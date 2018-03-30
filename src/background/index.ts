import axios from "axios";
import Pusher from "pusher-js";
import { Member } from "../services/Member";
import { Notice } from "../services/Notice";
import { Team } from "../services/Team";

class Background {
    public teams: { [guid: string]: Team } = {};
    public pusher: Pusher.Pusher;
    public privateChannel?: Pusher.Channel;
    public audio: HTMLAudioElement;

    constructor() {
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

    public async subscribePrivateChannel() {
        if (this.team instanceof Team && this.member instanceof Member) {
            // 订阅前先切换到订阅消息的团队，不然会订阅失败
            await axios.get(`https://tower.im/teams/${this.team.guid}`, { withCredentials: true });
            this.privateChannel = this.pusher.subscribe(`private-member-${this.member.id}`);
            this.privateChannel.bind("client-notify", this.createNotice.bind(this));
        }
    }

    public async start() {
        // 获取所有团队
        (await Team.getTeams()).forEach((team) => this.teams[team.guid] = team);

        // 判断 this.team 是否存在
        if (!(this.team instanceof Team)) {
            this.team = this.teams[Object.keys(this.teams)[0]];
        }

        // 订阅私有频道
        await this.subscribePrivateChannel();

        // 15分钟刷新一次未读数量
        setInterval(async () => {
            if (this.team instanceof Team) {
                this.unreadCount = await Notice.getUnreadCount(this.team.guid);
            }
        }, 1000 * 60 * 15);
    }

    private async createNotice(data: any) {
        const notification = new Notification(data.late_notice, {
            body: data.late_content,
            icon: "/icon.png",
            tag: data.replaceId,
        });

        // 点击打开链接
        notification.onclick = () => window.open(`https://tower.im/${data.late_url}`);

        // 显示播放提示音
        notification.onshow = () => this.audio.play();

        if (this.team instanceof Team) {
            this.unreadCount = await Notice.getUnreadCount(this.team.guid);
        }
    }
}

const background = (window as any).background = new Background();
background.start();
