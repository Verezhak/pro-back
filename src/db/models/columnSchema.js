import { model, Schema } from 'mongoose';



const columnSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Dashboard",
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

columnSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const ColumnCollection = model('column', columnSchema);