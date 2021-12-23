import axios from "axios";
import urljoin from "url-join";
import { User } from "../models/interfaces/user";
import { UserData } from "../models/interfaces/user-data";

export class UserFunctions {
    constructor(private netlifyIdentityUrl: string) { }

    async registerUser(email: string, password: string, userData: UserData): Promise<User> {
        var registerUserUrl = urljoin(this.netlifyIdentityUrl, 'signup');
        var result = await axios.post(registerUserUrl, {
            email: email,
            password: password,
            userData: userData
        });

        return result.data;
    }
}