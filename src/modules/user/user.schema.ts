import * as mongoose from 'mongoose';

import { Document } from 'mongoose'

export interface IUserDocument extends Document {
    fullName : string;
    username : string;
    email : string;
    age : number;
    password : string;
    avatar ?: string;
    city ?: string;
    state ?: string;
    country ?: string;
    roles :Array<string>; 
    isActive ?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    roles: [{
        type: String,
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: Date
});

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}


export interface IForgetPasswordDocument extends Document {
    pin: number;
    email: string;
    readonly createdAt: Date;
  }
  
const ForgetPasswordSchema = new mongoose.Schema({
    email: String,
    pin: Number,
    createdAt: { type: Date, default: Date.now }
});

export {UserSchema, ForgetPasswordSchema}
