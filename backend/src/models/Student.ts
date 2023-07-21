import mongoose from 'mongoose';
import { IUser } from "./User";
import { ICourse } from "./Course";
const Schema = mongoose.Schema;

export interface IStudent extends mongoose.Document {
    student: IUser,
    studentID: Number
    courses: [ICourse],
}

const StudentSchema = new mongoose.Schema({

    student: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    studentID: {
        type: Number,
        required: true,
    },

    courses: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: "Course"
    }

}, {
    timestamps: true
})

const Student = mongoose.model<IStudent>("Student", StudentSchema);

export default Student;