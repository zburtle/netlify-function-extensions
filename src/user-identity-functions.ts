import axios from "axios";
import { GoTrueNodeUser } from "./models/interfaces/go-true-node-user";
import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";

export class UserIdentityFunctions {
    constructor(private event: Event, private context: Context) { }

    get identity(): any {
        return this.context.clientContext?.identity;
    }

    get callingUser(): GoTrueNodeUser {
        return this.context.clientContext?.user;
    }

    async registerUser<T extends GoTrueNodeUser>(email: string, password: string): Promise<T> {
        var registerUserUrl = `${this.identity.url}/signup`;
        var result = await axios.post(registerUserUrl, {
            email: email,
            password: password
        });

        return result.data;
    }

    async inviteUser<T extends GoTrueNodeUser>(email: string): Promise<T> {
        var inviteUserUrl = `${this.identity.url}/invite`;
        var result = await axios.post(inviteUserUrl, {
            email: email
        }, { 
            headers: { 
                Authorization: `Bearer ${this.identity.token}` 
            }
        });

        return result.data;
    }

    async updateUser<T extends GoTrueNodeUser>(user: T): Promise<void> {
        var updateUserUrl = `${this.identity.url}/user`;
        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` }});
    }

    async isUserAdministrator(user:GoTrueNodeUser): Promise<boolean> {
        return await this.isUserInRole(user, 'Adminsitrator');
    }

    async isCallingUserInRole(roleName: string): Promise<boolean> {
        return this.callingUser.app_metadata.roles.some((x: string) => x == roleName);
    }

    async isUserInRole(user: GoTrueNodeUser, roleName: string): Promise<boolean> {
        return user.app_metadata.roles.some((x: string) => x == roleName);
    }

    async isCallingUserInAnyRole(roleNames: string[]): Promise<boolean> {
        return this.callingUser.app_metadata.roles.some((x: string) => roleNames.some((y: string) => x == y));
    }

    async isUserInAnyRole(user: GoTrueNodeUser, roleNames: string[]): Promise<boolean> {
        return user.app_metadata.roles.some((x: string) => roleNames.some((y: string) => x == y));
    }
}