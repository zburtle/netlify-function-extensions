import axios from "axios";
import urljoin from "url-join";
import { User } from "../models/interfaces/user";
import { Users } from "../models/interfaces/users";

export class AdminFunctions {
    private usersUrl: string = '/admin/users';

    constructor(private netlifyIdentityUrl: string) { }

    async getAllUsers(token: string): Promise<Users> {
        var getAllUsersUrl = urljoin(this.netlifyIdentityUrl, this.usersUrl);
        var results = await axios.get<Users>(getAllUsersUrl, { headers: { Authorization: `Bearer ${token}` }});

        return results.data;
    }

    async getUserById(userId: string, token: string): Promise<User> {
        var getUserByIdUrl = urljoin(this.netlifyIdentityUrl, this.usersUrl, userId);
        var result = await axios.get<User>(getUserByIdUrl, { headers: { Authorization: `Bearer ${token}` }});

        return result.data;
    }

    async updateUser(user: User, userId:string, token: string): Promise<void> {
        var updateUserUrl = urljoin(this.netlifyIdentityUrl, this.usersUrl, userId);
        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${token}` }});
    }

    async deleteUser(userId:string, token: string): Promise<void> {
        var deleteUserUrl = urljoin(this.netlifyIdentityUrl, this.usersUrl, userId);
        await axios.delete(deleteUserUrl, { headers: { Authorization: `Bearer ${token}` }});
    }
}