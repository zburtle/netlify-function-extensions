import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { AdminIdentityFunctions } from "./admin-identity-functions";
import { GoTrueNodeUser } from "./models/interfaces/go-true-node-user";
import { UserIdentityFunctions } from "./user-identity-functions";

export class NetlifyHelper {
    public adminIdentityFunctions: AdminIdentityFunctions;
    public userIdentityFunctions: UserIdentityFunctions;

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

    getBodyObject<T>(): T {
        return JSON.parse(this.event.body ?? '') as T;
    }
}