import { AppMetaData } from "./app-metadata";
import { UserMetaData } from "./user-metadata";

export interface User<T = AppMetaData, U = UserMetaData> {
    id: string;
    sub: string;
    aud: string;
    role: string;
    email: string;
    password: string;
    confirmation_sent_at: Date;
    app_metadata: T,
    user_metadata: U,
    created_at: Date;
    updated_at: Date;
}