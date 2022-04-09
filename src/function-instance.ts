import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { AdminFunctions } from "./admin-functions";
import { User } from "./models/interfaces/user";
import { UserFunctions } from "./user-functions";

export class FunctionInstance {
    public admin: AdminFunctions;
    public user: UserFunctions;

    constructor(private event: Event, private context: Context) {
        this.admin = new AdminFunctions(context.clientContext?.identity);
        this.user = new UserFunctions(context.clientContext?.identity);
    }

    get callingUser(): User {
        return this.context.clientContext?.user;
    }

    get adminToken(): string {
        return this.context.clientContext?.identity.token;
    }
}