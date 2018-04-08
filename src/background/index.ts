import axios from "axios";
import Pusher from "pusher-js";
import Raven from "raven-js";
import uuid from "uuid";
import { Member } from "../services/Member";
import { Notice } from "../services/Notice";
import { Team } from "../services/Team";

Raven
    .config("https://a2dde95b2714404ba3f90f4738ef3bea@sentry.io/1164047")
    .install();

class Background {
    public teams: { [guid: string]: Team } = {};
    public pusher: Pusher.Pusher;
    public audio: HTMLAudioElement;

    constructor() {
        Raven.setUserContext({ clientId: this.clientId });

        this.pusher = new Pusher("bb025b016f19e1824544289f1246f0b1", {
            activityTimeout: 12e4,
            authEndpoint: "https://tower.im/pusher/auth",
            disableStats: true,
            encrypted: true,
            pongTimeout: 3e3,
            wsHost: "pusher.tower.im",
            wsPort: 8082,
            wssPort: 8082,
        });

        this.audio = document.createElement("audio");
        this.audio.src = "/notification.mp3";
        document.body.appendChild(this.audio);
    }

    get clientId(): string {
        const clientId = localStorage.getItem("clientId") || uuid();
        localStorage.setItem("clientId", clientId);
        return clientId;
    }

    get unreadCount(): number {
        return parseInt(localStorage.getItem("unreadCount") || "0", 10) || 0;
    }

    set unreadCount(unreadCount: number) {
        if (unreadCount > 0) {
            chrome.browserAction.setBadgeText({ text: unreadCount.toString() });
        } else {
            chrome.browserAction.setBadgeText({ text: "" });
        }

        localStorage.setItem("unreadCount", unreadCount.toString());
    }

    get team(): Team | undefined {
        const currentTeamGuid = localStorage.getItem("currentTeamGuid") || "";
        if (this.teams[currentTeamGuid]) {
            return this.teams[currentTeamGuid];
        }
    }

    set team(team: Team | undefined) {
        if (team) {
            localStorage.setItem("currentTeamGuid", team.guid);
        }
    }

    get member(): Member | undefined {
        if (this.team instanceof Team) {
            return this.team.member;
        }
    }

    public async subscribeTeamNotification(team: Team) {
        // 订阅团队通知前要先切换团队，否则会订阅失败
        await axios.get(`https://tower.im/teams/${team.guid}`, { withCredentials: true });

        // 订阅私有频道
        const privateChannel = this.pusher.subscribe(`private-member-${team.member.id}`);

        // 绑定客户端通知事件
        privateChannel.bind("client-notify", this.createNotification.bind(this));

        await new Promise((resolve, reject) => {
            privateChannel.bind("pusher:subscription_succeeded", () => {
                Raven.captureMessage(`订阅 private-member-${team.member.id} 频道成功`, { level: "info" });
                resolve();
            });

            privateChannel.bind("pusher:subscription_error", () => {
                Raven.captureException(new Error(`订阅 private-member-${team.member.id} 频道失败`));
                reject();
            });
        });
    }

    public async start() {
        Raven.captureMessage(`启动插件`, { level: "info" });

        // 获取所有团队
        (await Team.getTeams()).forEach((team) => this.teams[team.guid] = team);

        // 判断默认团队是否设置，未设置就设置第一个团队为默认团队
        if (!(this.team instanceof Team)) {
            this.team = this.teams[Object.keys(this.teams)[0]];
        }

        // 订阅所有团队频道
        for (const team of Object.keys(this.teams).map((key: string) => this.teams[key])) {
            await this.subscribeTeamNotification(team);
        }

        // 15分钟被动刷新一次未读数量
        setInterval(async () => {
            if (this.team instanceof Team) {
                this.unreadCount = await Notice.getUnreadCount(this.team.guid);
                Raven.captureMessage(`定时刷新 ${this.team.guid} 团队未读通知数量为 ${this.unreadCount}`, { level: "info" });
            }
        }, 1000 * 60 * 15);
    }

    private async createNotification(data: any) {
        if (data.op === "ADD") {
            const notification = new Notification(data.late_notice, {
                body: data.late_content,
                icon: "/icon.png",
                tag: data.replaceId,
            });

            // 点击打开链接
            notification.onclick = () => window.open(`https://tower.im/${data.late_url}`);

            // 显示播放提示音
            notification.onshow = () => this.audio.play();

            Raven.captureMessage(`创建桌面通知`, { level: "info" });
        }

        if (this.team instanceof Team) {
            this.unreadCount = await Notice.getUnreadCount(this.team.guid);
        }
    }
}

Raven.context(() => {
    const background = (window as any).background = new Background();
    background.start();
});
