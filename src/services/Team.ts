import axios from "axios";
import cheerio from "cheerio";

export class Team {
    public static async getTeams(): Promise<Team[]> {
        const response = await axios.get(`https://tower.im/launchpad?skip=1`, {
            withCredentials: true,
        });

        const data: Team[] = [];
        const $ = cheerio.load(response.data);
        $(".teams").map((teamIndex, team) => {
            // Id
            const idMatched = $(team).find("a").first().attr("href").match(/\/teams\/(.*)\/projects/);
            const id = idMatched ? idMatched[1] : "";

            // 名称
            const name = $(team).find(".name").first().html() || "";

            data.push(new Team(id, name));
        });

        return data;
    }

    public id: string;
    public name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
