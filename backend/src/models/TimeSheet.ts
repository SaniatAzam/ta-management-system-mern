import mongoose from "mongoose";
import { ICourse } from "./Course";
import { IUser } from "./User";
const Schema = mongoose.Schema;

export interface ITimeSheet extends mongoose.Document {
  user: IUser,
  course: ICourse,
  office_hours_from: string,
  office_hours_to: string,
  office_hours_day: string,
  office_location: string,
  duties: string
}

const TimeSheetSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    office_hours_day: {
      type: String,
      required: true,
      enum: ["M", "T", "W", "TR", "F"]
    },
    office_hours_from: {
      type: String,
      required: true
    },

    office_hours_to: {
      type: String,
      required: true
    },

    office_location: {
      type: String,
      required: true
    },
    duties: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const TimeSheet = mongoose.model<ITimeSheet>("TimeSheet", TimeSheetSchema);

export default TimeSheet;