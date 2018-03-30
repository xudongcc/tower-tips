import axios from "axios";
import cheerio from "cheerio";
import { Team } from "./Team";

export class Member {
    public static async getUser(teamId?: string): Promise<Member> {
        teamId = teamId || localStorage.getItem("teamId") || (await Team.getTeams())[0].guid;
        const response = await axios.get(`https://tower.im/teams/${teamId}`, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
            withCredentials: true,
        });

        const $ = cheerio.load(response.data);
        const id = $("#member-id").val();
        const guid = $("#member-guid").val();
        const nickname = $("#member-nickname").val();
        const avatar = $("#member-avatar").val();
        // const admin = $("#member-admin").length > 0;
        // const owner = $("#member-owner").length > 0;
        // const visitor = $("#member-visitor").length > 0;
        // const tz = $("#member-timezone").val();

        return new Member(id, guid, nickname, avatar);
    }

    public id: string;
    public guid: string;
    public nickname: string;
    public avatar: string;

    constructor(
        id: string,
        guid: string,
        nickname: string,
        avatar: string,
    ) {
        this.id = id;
        this.guid = guid;
        this.nickname = nickname;
        this.avatar = avatar;
    }
}
