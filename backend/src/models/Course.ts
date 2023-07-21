import mongoose from 'mongoose';
import { IProfessor } from "./Professor";
import { ITACohort } from './TACohort';

const Schema = mongoose.Schema;

enum Term {
    Fall = "fall",
    Spring = "spring",
    Summer = "summer"
}

enum CourseType {
    Regular = "regular",
    Seminar = "seminar",
    Lab = "lab",
    Other = "other"
}

export interface ICourse extends mongoose.Document {
    courseName: string,
    courseDesc: string,
    term: Term,
    year: Number,
    courseNumber: string,
    courseInstructor: IProfessor,
    courseType: CourseType,
    courseEnrollmentNumber: Number,
    taQuota: Number,
    assignedTAs: [ITACohort]
}

const CourseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        required: true,
    },

    courseDesc: {
        type: String,
        required: true,
    },

    term: {
        type: String,
        required: true,
    },

    year: {
        type: Number,
        required: true,
    },

    courseNumber: {
        type: String,
        required: true,
    },

    courseInstructor: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    courseType: {
        type: String,
        required: true
    },

    courseEnrollmentNumber: {
        type: Number,
        required: false
    },

    taQuota: {
        type: Number,
        required: false
    },

    assignedTAs: {
        type: [Schema.Types.ObjectId],
        required: false,
        ref: "TACohort"
    }

}, {
    timestamps: true
})

const Course = mongoose.model<ICourse>("Course", CourseSchema);

export default Course;