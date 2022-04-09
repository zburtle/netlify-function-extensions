import axios from "axios";
import { AppMetaData } from "../models/interfaces/app-metadata";
import { User } from "../models/interfaces/user";
import { UserMetaData } from "../models/interfaces/user-metadata";
import { Users } from "../models/interfaces/users";
import { UserFunctions } from "./user-functions";

export class AdminFunctions {
    private usersUrl: string = 'admin/users';
    private userFunctions: UserFunctions;

    constructor(private identity: any) {
        this.userFunctions = new UserFunctions(identity);
    }

    async getAllUsers(): Promise<Users> {
        var getAllUsersUrl = `${this.identity.url}/${this.usersUrl}?per_page=${100000}`;
        var results = await axios.get<Users>(getAllUsersUrl, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return results.data;
    }

    async getUserById(userId: string): Promise<User> {
        var getUserByIdUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;
        var result = await axios.get<User>(getUserByIdUrl, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return result.data;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        var allUsers = await this.getAllUsers();
        var users = allUsers.users.filter(x => x.email == email);

        if (users && users.length > 0) {
            return users[0];
        }
        else {
            return null;
        }
    }

    async createUser(user: User): Promise<User> {
        var updateUserUrl = `${this.identity.url}/${this.usersUrl}`;
        var result = await axios.post(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return result.data;
    }

    async updateUser(user: User): Promise<void> {
        var userId = (await this.getUserByEmail(user.email))?.id;
        var updateUserUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;

        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` }});
    }

    async deleteUser(userId:string): Promise<void> {
        var deleteUserUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;
        await axios.delete(deleteUserUrl, { headers: { Authorization: `Bearer ${this.identity.token}` }});
    }

    async isUserAdministrator(userId:string, adminRoleName: string = 'Administrator'): Promise<boolean> {
        return await this.isUserInRole(userId, adminRoleName);
    }

    async isUserInRole(userId: string, roleName: string): Promise<boolean> {
        var user = await this.getUserById(userId);

        return user.app_metadata.roles.some((x: string) => x == roleName);
    }

    async isUserInAnyRole(userId: string, roleNames: string[]): Promise<boolean> {
        var user = await this.getUserById(userId);

        return user.app_metadata.roles.some((x: string) => roleNames.some((y: string) => x == y));
    }

    async registerUserWithMetadata(email: string, password: string, appMetaData: AppMetaData, userMetaData: UserMetaData): Promise<User> {
        var newUser = await this.userFunctions.registerUser(email, password);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser(newUser);

        return newUser;
    }

    async registerUserWithAppMetadata(email: string, password: string, appMetaData: AppMetaData): Promise<User> {
        var newUser = await this.userFunctions.registerUser(email, password);
        newUser.app_metadata = appMetaData;

        await this.updateUser(newUser);

        return newUser;
    }

    async inviteUserWithMetadata(email: string, appMetaData: AppMetaData, userMetaData: UserMetaData): Promise<User> {
        var newUser = await this.userFunctions.inviteUser(email);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser(newUser);

        return newUser;
    }

    async inviteUserWithAppMetadata(email: string, appMetaData: AppMetaData): Promise<User> {
        var newUser = await this.userFunctions.inviteUser(email);
        newUser.app_metadata = appMetaData;

        await this.updateUser(newUser);

        return newUser;
    }
}