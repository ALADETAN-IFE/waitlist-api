import mongoose, { Schema, Document } from 'mongoose';
import { userPayload } from '../types/interfaces';

export interface IUser extends userPayload, Document {
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true,
            unique: true 
        },
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;