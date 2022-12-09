import { GoTrueNodeUser } from "./go-true-node-user";

export interface Users<T extends GoTrueNodeUser> {
    audience: string;
    users: T[];
}