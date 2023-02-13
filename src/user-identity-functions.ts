import axios from "axios";
import { NetlifyIdentityUser } from "./models/interfaces/netlify-identity-user";
import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";

export class UserIdentityFunctions {
    constructor(private event: Event, private context: Context) { }

    get identity(): any {
        return this.context.clientContext?.identity;
    }

    get callingUser(): NetlifyIdentityUser {
        return this.context.clientContext?.user;
    }

    async registerUser<T extends NetlifyIdentityUser>(email: string, password: string): Promise<T> {
        var registerUserUrl = `${this.identity.url}/signup`;
        var result = await axios.post(registerUserUrl, {
            email: email,
            password: password
        });

        return result.data;
    }

    async inviteUser<T extends NetlifyIdentityUser>(email: string): Promise<T> {
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

    async updateUser<T extends NetlifyIdentityUser>(user: T): Promise<void> {
        var updateUserUrl = `${this.identity.url}/user`;
        await axios.put(updateUserUrl, user, { headers: { Authorization: `Bearer ${this.identity.token}` }});
    }

    async isUserAdministrator(user:NetlifyIdentityUser): Promise<boolean> {
        return await this.isUserInRole(user, 'Administrator');
    }

    async isCallingUserInRole(roleName: string): Promise<boolean> {
        return this.callingUser.app_metadata.roles.some((x: string) => x == roleName);
    }

    async isUserInRole(user: NetlifyIdentityUser, roleName: string): Promise<boolean> {
        return user.app_metadata.roles.some((x: string) => x == roleName);
    }

    async isCallingUserInAnyRole(roleNames: string[]): Promise<boolean> {
        return this.callingUser.app_metadata.roles.some((x: string) => roleNames.some((y: string) => x == y));
    }

    async isUserInAnyRole(user: NetlifyIdentityUser, roleNames: string[]): Promise<boolean> {
        return user.app_metadata.roles.some((x: string) => roleNames.some((y: string) => x == y));
    }
}