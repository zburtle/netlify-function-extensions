import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { AdminFunctions } from "./admin-functions";
import { GoTrueNodeUser } from "./models/interfaces/go-true-node-user";
import { UserFunctions } from "./user-functions";

export class FunctionInstance {
    public admin: AdminFunctions;
    public user: UserFunctions;

    constructor(private event: Event, private context: Context) {
        this.admin = new AdminFunctions(context.clientContext?.identity);
        this.user = new UserFunctions(context.clientContext?.identity);
    }

    get callingUser(): GoTrueNodeUser {
        return this.context.clientContext?.user;
    }

    get adminToken(): string {
        return this.context.clientContext?.identity.token;
    }
}