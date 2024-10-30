

import { model, Schema } from 'mongoose';
import { contactTypeList, phoneNumberRegexp } from '../../constants/index.js';


const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        phoneNumber: {
            type: String,
            match: phoneNumberRegexp,
            required: true,
        },

        email: {
            type: String,
            unique: true,
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },

        contactType: {
            type: String,
            enum: contactTypeList,
            required: true,
            default: 'personal',
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        photo: {
            type: String,
        }
    },

    {
        timestamps: true,
        versionKey: false,
    },
);



export const ContactsCollection = model('contacts', contactSchema);
