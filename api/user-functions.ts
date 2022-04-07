import axios from "axios";
import { User } from "../models/interfaces/user";

export class UserFunctions {
    constructor(private identity: any) { }

    async registerUser(email: string, password: string): Promise<User> {
        var registerUserUrl = `${this.identity.url}/signup`;
        var result = await axios.post(registerUserUrl, {
            email: email,
            password: password
        });

        return result.data;
    }

    async inviteUser(email: string, token: string): Promise<User> {
        var inviteUserUrl = `${this.identity.url}/invite`;
        var result = await axios.post(inviteUserUrl, {
            email: email
        }, { 
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        });

        return result.data;
    }

    async updateUser(user: User, token: string): Promise<void> {
        var updateUserUrl = `${this.identity.url}/user`;
        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${token}` }});
    }
}