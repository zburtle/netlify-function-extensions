import axios from "axios";
import { GoTrueNodeUser } from "./models/interfaces/go-true-node-user";

export class UserFunctions {
    constructor(private identity: any) { }

    async registerUser<T extends GoTrueNodeUser>(email: string, password: string): Promise<T> {
        var registerUserUrl = `${this.identity.url}/signup`;
        var result = await axios.post(registerUserUrl, {
            email: email,
            password: password
        });

        return result.data;
    }

    async inviteUser<T extends GoTrueNodeUser>(email: string): Promise<T> {
        var inviteUserUrl = `${this.identity.url}/invite`;
        var result = await axios.post(inviteUserUrl, {
            email: email
        }, { 
            headers: { 
                Authorization: `Bearer ${this.identity.token}` 
            }
        });

        return result.data;
    }

    async updateUser<T extends GoTrueNodeUser>(user: T): Promise<void> {
        var updateUserUrl = `${this.identity.url}/user`;
        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` }});
    }
}