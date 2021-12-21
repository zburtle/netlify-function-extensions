export interface User {
    id: string;
    aud: string;
    role: string;
    email: string;
    confirmation_sent_at: Date;
    app_metadata: any,
    user_metadata: any,
    created_at: Date;
    updated_at: Date;
}