import axios from 'axios';
import urljoin from 'url-join';
import { User } from '../models/interfaces/user';

export class UserFunctions {
    constructor(private netlifyIdentityUrl: string) {
    }

    async getAllUsers(token: string): Promise<User[]> {
        var getAllUsersUrl = urljoin(this.netlifyIdentityUrl, '/admin/users');
        var results = await axios.get<User[]>(getAllUsersUrl, { headers: { Authorization: `Bearer ${token}` }});

        return results.data;
    }

    async getUserById(userId: string, token: string): Promise<User> {
        var getUserByIdUrl = urljoin(this.netlifyIdentityUrl, `/admin/users/${userId}`);
        var result = await axios.get<User>(getUserByIdUrl, { headers: { Authorization: `Bearer ${token}` }});

        return result.data;
    }
}