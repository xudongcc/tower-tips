import axios from "axios";
import cheerio from "cheerio";
import { Member } from "./Member";

export class Team {
    public static async getTeams(): Promise<Team[]> {
        const response = await axios.get(`https://tower.im/launchpad?skip=1`, {
            withCredentials: true,
        });

        const teams: Team[] = [];
        const $ = cheerio.load(response.data);

        for (const team of Array.prototype.slice.call($(".teams > li:not(.new)"))) {
            // GUID
            const matched = $(team).find("a").first().attr("href").match(/\/teams\/(.*)\/projects/);
            const guid = matched ? matched[1] : "";

            // 名称
            const name = $(team).find(".name").first().text() || "";

            // 用户
            const member = await Member.getUser(guid);

            teams.push(new Team(guid, name, member));
        }

        return teams;
    }

    public guid: string;
    public name: string;
    public member: Member;

    constructor(guid: string, name: string, member: Member) {
        this.guid = guid;
        this.name = name;
        this.member = member;
    }
}
