import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { AdminIdentityFunctions } from "./admin-identity-functions";
import { GoTrueNodeUser } from "./models/interfaces/go-true-node-user";
import { UserIdentityFunctions } from "./user-identity-functions";

export class NetlifyHelper {
    public adminIdentityFunctions: AdminIdentityFunctions;
    private userIdentityFunctions: UserIdentityFunctions;

    constructor(private event: Event, private context: Context) {
        this.adminIdentityFunctions = new AdminIdentityFunctions(event, context);
        this.userIdentityFunctions = new UserIdentityFunctions(event, context);
    }

    get callingUser(): GoTrueNodeUser {
        return this.context.clientContext?.user;
    }

    get adminToken(): string {
        return this.context.clientContext?.identity.token;
    }

    get identity(): any {
        return this.context.clientContext?.identity;
    }

    getBodyObject<T>(): T {
        return JSON.parse(this.event.body ?? '') as T;
    }

    async registerUser<T extends GoTrueNodeUser>(email: string, password: string): Promise<T> {
        return await this.userIdentityFunctions.registerUser(email, password);
    }

    async inviteUser<T extends GoTrueNodeUser>(email: string): Promise<T> {
        return await this.userIdentityFunctions.inviteUser(email);
    }

    async updateUser<T extends GoTrueNodeUser>(user: T): Promise<void> {
        return await this.userIdentityFunctions.updateUser(user);
    }

    async isUserAdministrator(user: GoTrueNodeUser): Promise<boolean> {
        return await this.userIdentityFunctions.isUserAdministrator(user);
    }

    async isCallingUserInRole(roleName: string): Promise<boolean> {
        return await this.userIdentityFunctions.isCallingUserInRole(roleName);
    }

    async isUserInRole(user: GoTrueNodeUser, roleName: string): Promise<boolean> {
        return await this.userIdentityFunctions.isUserInRole(user, roleName);
    }

    async isCallingUserInAnyRole(roleNames: string[]): Promise<boolean> {
        return this.userIdentityFunctions.isCallingUserInAnyRole(roleNames);
    }

    async isUserInAnyRole(user: GoTrueNodeUser, roleNames: string[]): Promise<boolean> {
        return await this.userIdentityFunctions.isUserInAnyRole(user, roleNames);
    }
}