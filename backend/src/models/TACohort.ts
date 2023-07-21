import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { IUser } from "./User";

export interface ITACohort extends mongoose.Document {
  term_year: string,
  ta_user: IUser,
  student_ID: Number,
  legal_name: String,
  email: String,
  degree: String,
  supervisor_name: String,
  priority: Boolean,
  hours: Number,
  date_applied: Date,
  location?: string,
  phone: string,
  courses_applied_for_list: [string],
  open_to_other_courses: Boolean,
  notes?: string
}

const TACohortSchema = new mongoose.Schema(
  {
    term_year: {
      type: String,
      required: true,
    },

    ta_user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },

    student_ID: {
      type: Number,
      required: true,
    },

    legal_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    degree: {
      type: String,
      enum: ["ugrad", "grad"],
      required: true,
    },

    supervisor_name: {
      type: String,
      required: true,
    },

    priority: {
      type: Boolean,
      required: true,
    },

    hours: {
      type: Number,
      enum: [90, 180],
      required: false,
    },

    date_applied: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: true,
    },

    courses_applied_for_list: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "Course"
    },

    open_to_other_courses: {
      type: Boolean,
      required: true
    },

    notes: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

const TACohort = mongoose.model<ITACohort>("TACohort", TACohortSchema);

export default TACohort;
