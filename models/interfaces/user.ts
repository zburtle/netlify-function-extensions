import { AppMetaData } from "./app-metadata";
import { UserMetaData } from "./user-metadata";

export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    confirmation_sent_at: Date;
    app_metadata: AppMetaData,
    user_metadata: UserMetaData,
    created_at: Date;
    updated_at: Date;
}