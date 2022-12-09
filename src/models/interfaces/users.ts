import { User } from "./user";

export interface Users<T extends User> {
    audience: string;
    users: T[];
}