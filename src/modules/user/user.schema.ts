import * as mongoose from 'mongoose';
import * as bcrypt from "bcrypt";
import { INTERESTS, jwtConstants, TRIBES } from 'src/constants';
import { Document } from 'mongoose'

export interface IUserDocument extends Document {
    firstName : string;
    lastName : string;
    displayName : string;
    email : string;
    phone : string;
    password : string;
    avatar ?: string;
    cover ?: string;
    city ?: string;
    country ?: string;
    roles :Array<string>;
    postalCode: string;
    about: string;
    preferences: Array<string>;
    interests: Array<string>;
    isActive ?: boolean;
    emailVerified ?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;

    // Actions
    addTribe(id: string);
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
    cover: {
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
    postalCode: {
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
    preferences: [{
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
    interests: [
        { 
          type: mongoose.Types.ObjectId,
          ref: INTERESTS
        }
    ],
    tribes: [
        { 
          type: mongoose.Types.ObjectId,
          ref: TRIBES
        }
    ],
    deletedAt: Date
}, { timestamps: true });

// UserSchema.pre('save', (next: any, done: any) => {
//     this.password = bcrypt.hashSync(signupDto.password, jwtConstants.salt)
//     return next();
// })
UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

UserSchema.methods.addTribe = function (id: string) {
    this.tribes.push(id);
    this.save();
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
