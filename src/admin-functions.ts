import axios from "axios";
import { AppMetaData } from "./models/interfaces/app-metadata";
import { User } from "./models/interfaces/user";
import { UserMetaData } from "./models/interfaces/user-metadata";
import { Users } from "./models/interfaces/users";
import { UserFunctions } from "./user-functions";

export class AdminFunctions {
    private usersUrl: string = 'admin/users';
    private userFunctions: UserFunctions;

    constructor(private identity: any) {
        this.userFunctions = new UserFunctions(identity);
    }

    async getAllUsers<T extends User>(): Promise<Users<T>> {
        var getAllUsersUrl = `${this.identity.url}/${this.usersUrl}?per_page=${100000}`;
        var results = await axios.get<Users<T>>(getAllUsersUrl, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return results.data;
    }

    async getUserById<T extends User>(userId: string): Promise<T> {
        var getUserByIdUrl = `${this.identity.url}/${this.usersUrl}/${userId}`;
        var result = await axios.get<T>(getUserByIdUrl, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return result.data;
    }

    async getUserByEmail<T extends User>(email: string): Promise<T | null> {
        var allUsers = await this.getAllUsers<T>();
        var users = allUsers.users.filter((x: T) => x.email == email);

        if (users && users.length > 0) {
            return users[0];
        }
        else {
            return null;
        }
    }

    async createUser<T extends User>(user: T): Promise<T> {
        var updateUserUrl = `${this.identity.url}/${this.usersUrl}`;
        var result = await axios.post(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` }});

        return result.data;
    }

    async updateUser<T extends User>(user: T): Promise<void> {
        var userId = (await this.getUserByEmail<T>(user.email))?.id;
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

    async registerUserWithMetadata<T extends User<U, V>, U extends AppMetaData, V extends UserMetaData>(email: string, password: string, appMetaData: U, userMetaData: V): Promise<T> {
        var newUser = await this.userFunctions.registerUser<T>(email, password);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser<T>(newUser);

        return newUser;
    }

    async registerUserWithAppMetadata<T extends User<U>, U extends AppMetaData>(email: string, password: string, appMetaData: U): Promise<T> {
        var newUser = await this.userFunctions.registerUser<T>(email, password);
        newUser.app_metadata = appMetaData;

        await this.updateUser<T>(newUser);

        return newUser;
    }

    async inviteUserWithMetadata<T extends User<U, V>, U extends AppMetaData, V extends UserMetaData>(email: string, appMetaData: U, userMetaData: V): Promise<T> {
        var newUser = await this.userFunctions.inviteUser<T>(email);
        newUser.app_metadata = appMetaData;
        newUser.user_metadata = userMetaData;
        
        await this.updateUser<T>(newUser);

        return newUser;
    }

    async inviteUserWithAppMetadata<T extends User<U>, U extends AppMetaData>(email: string, appMetaData: U): Promise<T> {
        var newUser = await this.userFunctions.inviteUser<T>(email);
        newUser.app_metadata = appMetaData;

        await this.updateUser<T>(newUser);

        return newUser;
    }
}