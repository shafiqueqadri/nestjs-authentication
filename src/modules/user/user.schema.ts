import * as mongoose from 'mongoose';
import { Document } from 'mongoose'

export interface IUserDocument extends Document {
    firstName : string;
    lastName : string;
    displayName : string;
    email : string;
    phone : string;
    password : string;
    avatar ?: string;
    city ?: string;
    country ?: string;
    roles :Array<string>;
    about: string;
    isActive ?: boolean;
    emailVerified ?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    avatar: {
        type: String,
    },
    displayName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    about: {
        type: String,
        default: ''
    },
    roles: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerified: {
        type: Boolean,
        default: true
    },
    deletedAt: Date
}, { timestamps: true });

// UserSchema.pre('save', (next: any, done: any) => {
//     this.password = bcrypt.hashSync(signupDto.password, jwtConstants.salt)
//     return next();
// })
UserSchema.methods.toJSON = function() {
    var obj: any = this.toObject();
    delete obj.password;
    return obj;
}

export interface IForgetPasswordDocument extends Document {
    code: string;
    email: string;
    readonly createdAt: Date;
  }
  
const ForgetPasswordSchema = new mongoose.Schema({
    email: String,
    code: String,
    createdAt: { type: Date, default: Date.now }
});

export {UserSchema, ForgetPasswordSchema}
