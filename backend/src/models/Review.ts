import { ICourse } from './Course';
import mongoose from 'mongoose';
import { IUser } from "./User";
import { ITACohort } from "./TACohort";
const Schema = mongoose.Schema;


export interface IReview extends mongoose.Document {
    ta: ITACohort,
    reviewer: IUser,
    course: ICourse,
    rating: number,
    comment: string
}

const ReviewSchema = new mongoose.Schema({
    ta: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TACohort"
    },

    reviewer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    course: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },

    rating: {
        type: Number,
        required: true,
    },

    comment: {
        type: String,
        required: false
    }


}, {
    timestamps: true
})

const Review = mongoose.model<IReview>("Review", ReviewSchema);

export default Review;