import axios from "axios";
import cheerio from "cheerio";

export class Notification {
    public static async getNotifications(teamId: string): Promise<Notification[]> {
        const response = await axios.get(`https://tower.im/teams/${teamId}/notifications/`, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
            withCredentials: true,
        });

        const data: Notification[] = [];
        const $ = cheerio.load(response.data);
        $(".notice").map((noticeIndex, notice) => {
            // 用户
            const member: any = {};
            member.id = $(notice).find(".member-avatar").first().attr("href").replace("/members/", "");
            member.avatar = $(notice).find("img.avatar").first().attr("src");
            if (member.avatar.indexOf("/") === 0) { member.avatar = `https://tower.im${member.avatar}`; }
            member.name = $(notice).find(".member").first().html();

            // 标签
            const tags: string[] = [];
            $(notice).find(".tag").map((tagIndex, tag) => {
                const tagHtml = $(tag).html();
                if (typeof tagHtml === "string") {
                    tags.push(tagHtml);
                }
            });

            // Id
            const idMatched = $(notice).find(".link").first().attr("href").match(/\/notifications\/(.*)/);
            const id = idMatched ? idMatched[1] : "";

            // 动作
            const action = $(notice).find(".action").first().html() || "";

            // 目标
            const target = $(notice).find(".-rest").first().html() || "";

            // 目标
            const content = $(notice).find(".content").first().html() || "";

            // 未读
            const unread = $(notice).hasClass("unread");

            // 创建时间
            const createdAt = $(notice).attr("data-created-at");

            data.push(new Notification(id, action, target, content, unread, createdAt, member, tags));
        });

        return data;
    }

    public id: string;
    public action: string;
    public target: string;
    public content: string;
    public unread: boolean;
    public createdAt: string;
    public member: any;
    public tags: string[];

    constructor(
        id: string,
        action: string,
        target: string,
        content: string,
        unread: boolean,
        createdAt: string,
        member: any,
        tags: string[],
    ) {
        this.id = id;
        this.action = action;
        this.target = target;
        this.content = content;
        this.unread = unread;
        this.createdAt = createdAt;
        this.member = member;
        this.tags = tags;
    }
}
