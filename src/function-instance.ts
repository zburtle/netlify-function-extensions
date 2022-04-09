import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { AdminFunctions } from "./admin-functions";
import { User } from "./models/interfaces/user";
import { UserFunctions } from "./user-functions";

export class FunctionInstance {
    public Admin: AdminFunctions;
    public User: UserFunctions;

    constructor(private event: Event, private context: Context) {
        this.Admin = new AdminFunctions(context.clientContext?.identity);
        this.User = new UserFunctions(context.clientContext?.identity);
    }

    get callingUser(): User {
        return this.context.clientContext?.user;
    }

    get adminToken(): string {
        return this.context.clientContext?.identity.token;
    }
}