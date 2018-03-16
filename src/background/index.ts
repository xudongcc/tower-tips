import Pusher from "pusher-js";
import uuid from "uuid";
import { Member } from "../services/Member";

class Background {
    private notifications: { [notificationId: string]: any } = {};
    private pusher: Pusher.Pusher;
    private member?: Member;
    private privateChannel?: Pusher.Channel;

    constructor() {
        this.pusher = new Pusher("bb025b016f19e1824544289f1246f0b1", {
            activityTimeout: 12e4,
            authEndpoint: "https://tower.im/pusher/auth",
            disableStats: true,
            enabledTransports: ["ws", "flash"],
            encrypted: true,
            pongTimeout: 3e3,
            wsHost: "pusher.tower.im",
            wsPort: 8082,
            wssPort: 8082,
        });
    }

    get teamId(): string {
        return localStorage.getItem("teamId") || "";
    }

    set teamId(teamId: string) {
        localStorage.setItem("teamId", teamId || "");
    }

    public async start() {
        this.member = await Member.getUser();
        this.privateChannel = this.pusher.subscribe(`private-member-${this.member.id}`);
        this.privateChannel.bind("client-notify", this.createNotification.bind(this));

        chrome.notifications.onClicked.addListener((notificationId: string) => {
            const data = this.notifications[notificationId];
            window.open(`https://tower.im/${data.late_url}`);
        });
    }

    private async createNotification(data: any) {
        const notificationId = uuid();
        this.notifications[notificationId] = data;

        chrome.notifications.create(notificationId, {
            iconUrl: "/icon.png",
            message: data.late_content,
            title: data.late_notice,
            type: "basic",
        });
    }
}

const background = (window as any).background = new Background();
background.start();
