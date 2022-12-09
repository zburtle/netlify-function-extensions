import { Token, User } from "gotrue-js";
import { AppMetaData } from "./app-metadata";
import { UserMetaData } from "./user-metadata";

export class GoTrueNodeUser<T = AppMetaData, U = UserMetaData> extends User {
    app_metadata!: T;
    aud!: string;
    audience!: string;
    confirmed_at!: string;
    created_at!: string;
    email!: string;
    id!: string;
    role!: string;
    sub!: string;
    token!: Token;
    updated_at!: string;
    url!: string;
    user_metadata!: U;
}