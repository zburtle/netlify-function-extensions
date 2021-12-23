import axios from "axios";
import urljoin from "url-join";
import { User } from "../models/interfaces/user";

export class UserFunctions {
    constructor(private netlifyIdentityUrl: string) { }

    async registerUser(email: string, password: string): Promise<User> {
        var registerUserUrl = urljoin(this.netlifyIdentityUrl, 'signup');
        var result = await axios.post(registerUserUrl, {
            email: email,
            password: password
        });

        return result.data;
    }
}