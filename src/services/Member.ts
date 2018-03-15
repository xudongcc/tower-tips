import axios from "axios";

export class Member {
    public static async getUser(id?: string): Promise<Member> {
        const response = await axios.get(`https://tower.im/`, {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
            withCredentials: true,
        });

        const data = JSON.parse(response.data.match(/window.intercomSettings = (.*);\(function\(\)/)[1]);

        return new Member(data.user_id, data.guid, data.name, data.email, new Date(data.created_at));
    }

    public id: number;
    public guid: string;
    public email: string;
    public name: string;
    public createdAt: Date;

    constructor(
        id: number,
        guid: string,
        name: any,
        email: string,
        createdAt: Date,
    ) {
        this.id = id;
        this.guid = guid;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
    }
}
