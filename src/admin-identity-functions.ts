import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import axios from "axios";
import { AppMetaData } from "./models/interfaces/app-metadata";
import { GoTrueNodeUser } from "./models/interfaces/go-true-node-user";
import { UserMetaData } from "./models/interfaces/user-metadata";
import { Users } from "./models/interfaces/users";
import { UserIdentityFunctions } from "./user-identity-functions";

export class AdminIdentityFunctions {
    private usersUrl: string = 'admin/users';
    private userFunctions: UserIdentityFunctions;

    constructor(private event: Event, private context: Context) {
        this.userFunctions = new UserIdentityFunctions(event, context);
    }

    get identity(): any {
        return this.context.clientContext?.identity;
    }

    async getAllUsers<T extends GoTrueNodeUser>(): Promise<Users<T>> {
        var getAllUsersUrl = `${this.identity.url}/${this.usersUrl}?per_page=${100000}`;
        var results = await axios.get<Users<T>>(getAllUsersUrl, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return results.data;
    }

    async getUserById<T extends GoTrueNodeUser>(userId: string): Promise<T> {
        var getUserByIdUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;
        var result = await axios.get<T>(getUserByIdUrl, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return result.data;
    }

    async getUserByEmail<T extends GoTrueNodeUser>(email: string): Promise<T | null> {
        var allUsers = await this.getAllUsers<T>();
        var users = allUsers.users.filter((x: T) => x.email == email);

        if (users && users.length > 0) {
            return users[0];
        }
        else {
            return null;
        }
    }

    async createUser<T extends GoTrueNodeUser>(user: T): Promise<T> {
        var updateUserUrl = `${this.identity.url}/${this.usersUrl}`;
        var result = await axios.post(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return result.data;
    }

    async updateUser<T extends GoTrueNodeUser>(user: T): Promise<void> {
        var userId = (await this.getUserByEmail<T>(user.email))?.id;
        var updateUserUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;

        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` }});
    }

    async deleteUser(userId:string): Promise<void> {
        var deleteUserUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;
        await axios.delete(deleteUserUrl, { headers: { Authorization: `Bearer ${this.identity.token}` }});
    }

    async registerUserWithMetadata<T extends GoTrueNodeUser<U, V>, U extends AppMetaData, V extends UserMetaData>(email: string, password: string, appMetaData: U, userMetaData: V): Promise<T> {
        var newUser = await this.userFunctions.registerUser<T>(email, password);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser<T>(newUser);

        return newUser;
    }

    async registerUserWithAppMetadata<T extends GoTrueNodeUser<U>, U extends AppMetaData>(email: string, password: string, appMetaData: U): Promise<T> {
        var newUser = await this.userFunctions.registerUser<T>(email, password);
        newUser.app_metadata = appMetaData;

        await this.updateUser<T>(newUser);

        return newUser;
    }

    async inviteUserWithMetadata<T extends GoTrueNodeUser<U, V>, U extends AppMetaData, V extends UserMetaData>(email: string, appMetaData: U, userMetaData: V): Promise<T> {
        var newUser = await this.userFunctions.inviteUser<T>(email);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser<T>(newUser);

        return newUser;
    }

    async inviteUserWithAppMetadata<T extends GoTrueNodeUser<U>, U extends AppMetaData>(email: string, appMetaData: U): Promise<T> {
        var newUser = await this.userFunctions.inviteUser<T>(email);
        newUser.app_metadata = appMetaData;

        await this.updateUser<T>(newUser);

        return newUser;
    }

    async isUserIdAdministrator(userId:string): Promise<boolean> {
        return await this.isUserIdInRole(userId, 'Adminsitrator');
    }

    async isUserIdInRole(userId: string, roleName: string): Promise<boolean> {
        var user = await this.getUserById(userId);

        return await this.userFunctions.isUserInRole(user, roleName);
    }

    async isUserIdInAnyRole(userId: string, roleNames: string[]): Promise<boolean> {
        var user = await this.getUserById(userId);

        return await this.userFunctions.isUserInAnyRole(user, roleNames);
    }
}