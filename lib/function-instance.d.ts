import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { AdminFunctions } from "./admin-functions";
import { User } from "./models/interfaces/user";
import { UserFunctions } from "./user-functions";
export declare class FunctionInstance {
    private event;
    private context;
    Admin: AdminFunctions;
    User: UserFunctions;
    constructor(event: Event, context: Context);
    get callingUser(): User;
    get adminToken(): string;
}
