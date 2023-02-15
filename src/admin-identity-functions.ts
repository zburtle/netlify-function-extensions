import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import axios from "axios";
import { NetlifyIdentityAppMetadata } from "./models/interfaces/netlify-identity-app-metadata";
import { NetlifyIdentityUser } from "./models/interfaces/netlify-identity-user";
import { NetlifyIdentityUserMetadata } from "./models/interfaces/netlify-identity-user-metadata";
import { Users } from "./models/interfaces/users";
import { UserIdentityFunctions } from "./user-identity-functions";

export class AdminIdentityFunctions {
    private usersUrl: string = 'admin/users';

    constructor(private identityUrl: string, private token: string, private userFunctions: UserIdentityFunctions) {
    }

    async getAllUsers<T extends NetlifyIdentityUser>(): Promise<Users<T>> {
        var getAllUsersUrl = `${this.identityUrl}/${this.usersUrl}?per_page=${100000}`;
        var results = await axios.get<Users<T>>(getAllUsersUrl, { headers: { Authorization: `Bearer ${this.token}` }});

        return results.data;
    }

    async getUserById<T extends NetlifyIdentityUser>(userId: string): Promise<T> {
        var getUserByIdUrl = `${this.identityUrl}/${this.usersUrl}/${userId}`;
        var result = await axios.get<T>(getUserByIdUrl, { headers: { Authorization: `Bearer ${this.token}` }});

        return result.data;
    }

    async getUserByEmail<T extends NetlifyIdentityUser>(email: string): Promise<T | null> {
        var allUsers = await this.getAllUsers<T>();
        var users = allUsers.users.filter((x: T) => x.email == email);

        if (users && users.length > 0) {
            return users[0];
        }
        else {
            return null;
        }
    }

    async createUser<T extends NetlifyIdentityUser>(user: T): Promise<T> {
        var updateUserUrl = `${this.identityUrl}/${this.usersUrl}`;
        var result = await axios.post(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.token}` }});

        return result.data;
    }

    async updateUser<T extends NetlifyIdentityUser>(user: T): Promise<void> {
        var userId = (await this.getUserByEmail<T>(user.email))?.id;
        var updateUserUrl = `${this.identityUrl}/${this.usersUrl}/${userId}`;

        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.token}` }});
    }

    async deleteUser(userId:string): Promise<void> {
        var deleteUserUrl = `${this.identityUrl}/${this.usersUrl}/${userId}`;
        await axios.delete(deleteUserUrl, { headers: { Authorization: `Bearer ${this.token}` }});
    }

    async registerUserWithMetadata<T extends NetlifyIdentityUser<U, V>, U extends NetlifyIdentityAppMetadata, V extends NetlifyIdentityUserMetadata>(email: string, password: string, appMetaData: U, userMetaData: V): Promise<T> {
        var newUser = await this.userFunctions.registerUser<T>(email, password);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser<T>(newUser);

        return newUser;
    }

    async registerUserWithAppMetadata<T extends NetlifyIdentityUser<U>, U extends NetlifyIdentityAppMetadata>(email: string, password: string, appMetaData: U): Promise<T> {
        var newUser = await this.userFunctions.registerUser<T>(email, password);
        newUser.app_metadata = appMetaData;

        await this.updateUser<T>(newUser);

        return newUser;
    }

    async inviteUserWithMetadata<T extends NetlifyIdentityUser<U, V>, U extends NetlifyIdentityAppMetadata, V extends NetlifyIdentityUserMetadata>(email: string, appMetaData: U, userMetaData: V): Promise<T> {
        var newUser = await this.userFunctions.inviteUser<T>(email);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser<T>(newUser);

        return newUser;
    }

    async inviteUserWithAppMetadata<T extends NetlifyIdentityUser<U>, U extends NetlifyIdentityAppMetadata>(email: string, appMetaData: U): Promise<T> {
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