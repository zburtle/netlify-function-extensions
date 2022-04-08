import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { AdminFunctions } from "../api/admin-functions";
import { UserFunctions } from "../api/user-functions";

export class FunctionInstance {
    public Admin: AdminFunctions;
    public User: UserFunctions;

    constructor(private event: Event, private context: Context) {
        this.Admin = new AdminFunctions(context.clientContext?.identity);
        this.User = new UserFunctions(context.clientContext?.identity);
    }
}