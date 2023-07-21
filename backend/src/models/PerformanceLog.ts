import mongoose from "mongoose";

export interface IPerformanceLog extends mongoose.Document {
  ta_name: string;
  ta_email: string;
  term_year: string;
  course_num: string;
  comment: string;
  professor_name: string;
}

const PerformanceLogSchema = new mongoose.Schema(
  {
    ta_name: {
      type: String,
      required: true,
    },

    ta_email: {
      type: String,
      requireed: true
    },

    term_year: {
      type: String,
      required: true,
    },

    course_num: {
      type: String,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    professor_name: {
      type: String,
      required: true,
    },


  },
  {
    timestamps: true,
  }
);

const PerformanceLog = mongoose.model<IPerformanceLog>("PerformanceLog", PerformanceLogSchema);

export default PerformanceLog;
