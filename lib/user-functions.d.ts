import { User } from "./models/interfaces/user";
export declare class UserFunctions {
    private identity;
    constructor(identity: any);
    registerUser(email: string, password: string): Promise<User>;
    inviteUser(email: string): Promise<User>;
    updateUser(user: User): Promise<void>;
}
