import axios from "axios";
import urljoin from "url-join";
import { User } from "../models/interfaces/user";

export class UserFunctions {
    constructor(private identity: any) { }

    async registerUser(email: string, password: string): Promise<User> {
        var registerUserUrl = urljoin(this.identity.url, 'signup');
        var result = await axios.post(registerUserUrl, {
            email: email,
            password: password
        });

        return result.data;
    }

    async inviteUser(email: string): Promise<User> {
        var inviteUserUrl = urljoin(this.identity.url, 'invite');
        var result = await axios.post(inviteUserUrl, {
            email: email
        });

        return result.data;
    }
}