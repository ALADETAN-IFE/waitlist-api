export interface userPayload {
    name?: string;
    email: string;
}

export interface EmailError {
    response?: {
        data?: any;  
    };
    message: string;
}