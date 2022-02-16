import axios from "axios";
import urljoin from "url-join";
import { AppMetaData } from "../models/interfaces/app-metadata";
import { User } from "../models/interfaces/user";
import { UserMetaData } from "../models/interfaces/user-metadata";
import { Users } from "../models/interfaces/users";
import { UserFunctions } from "./user-functions";

export class AdminFunctions {
    private usersUrl: string = '/admin/users';
    private userFunctions: UserFunctions;

    constructor(private identity: any) {
        this.userFunctions = new UserFunctions(identity);
    }

    async getAllUsers(token: string): Promise<Users> {
        var getAllUsersUrl = `${urljoin(this.identity.url, this.usersUrl)}?per_page=${100000}`;
        var results = await axios.get<Users>(getAllUsersUrl, { headers: { Authorization: `Bearer ${token}` }});

        return results.data;
    }

    async getUserById(userId: string, token: string): Promise<User> {
        var getUserByIdUrl = urljoin(this.identity.url, this.usersUrl, userId);
        var result = await axios.get<User>(getUserByIdUrl, { headers: { Authorization: `Bearer ${token}` }});

        return result.data;
    }

    async getUserByEmail(email: string, token: string): Promise<User | null> {
        var allUsers = await this.getAllUsers(token);
        var users = allUsers.users.filter(x => x.email == email);

        if (users && users.length > 0) {
            return users[0];
        }
        else {
            return null;
        }
    }

    async createUser(user: User, token: string): Promise<User> {
        var updateUserUrl = urljoin(this.identity.url, this.usersUrl);
        var result = await axios.post(updateUserUrl, user, { headers: { Authorization: `Bearer ${token}` }});

        return result.data;
    }

    async updateUser(user: User, token: string): Promise<void> {
        var updateUserUrl = urljoin(this.identity.url, this.usersUrl, user.id);
        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${token}` }});
    }

    async deleteUser(userId:string, token: string): Promise<void> {
        var deleteUserUrl = urljoin(this.identity.url, this.usersUrl, userId);
        await axios.delete(deleteUserUrl, { headers: { Authorization: `Bearer ${token}` }});
    }

    async isUserAdministrator(userId:string, token: string, adminRoleName: string = 'Administrator'): Promise<boolean> {
        return await this.isUserInRole(userId, token, adminRoleName);
    }

    async isUserInRole(userId: string, token: string, roleName: string): Promise<boolean> {
        var user = await this.getUserById(userId, token);

        return user.app_metadata.roles.some((x: string) => x == roleName);
    }

    async registerUserWithMetadata(email: string, password: string, appMetaData: AppMetaData, userMetaData: UserMetaData, token: string): Promise<User> {
        var newUser = await this.userFunctions.registerUser(email, password);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser(newUser, token);

        return newUser;
    }

    async registerUserWithAppMetadata(email: string, password: string, appMetaData: AppMetaData, token: string): Promise<User> {
        var newUser = await this.userFunctions.registerUser(email, password);
        newUser.app_metadata = appMetaData;

        await this.updateUser(newUser, token);

        return newUser;
    }

    async inviteUserWithMetadata(email: string, appMetaData: AppMetaData, userMetaData: UserMetaData, token: string): Promise<User> {
        var newUser = await this.userFunctions.inviteUser(email, token);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser(newUser, token);

        return newUser;
    }

    async inviteUserWithAppMetadata(email: string, appMetaData: AppMetaData, token: string): Promise<User> {
        var newUser = await this.userFunctions.inviteUser(email, token);
        newUser.app_metadata = appMetaData;

        await this.updateUser(newUser, token);

        return newUser;
    }
}