import mongoose from "mongoose";

export interface IProfTAWishlist extends mongoose.Document {
  term_year_this_is_for: string,
  course_num: string,
  prof_name: string,
  TA_name: string
}

const ProfTAWishlistSchema = new mongoose.Schema(
  {
    term_year_this_is_for: {
      type: String,
      required: true,
    },

    course_num: {
      type: String,
      required: true,
    },

    prof_name: {
      type: String,
      required: true,
    },

    TA_name: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const ProfTAWishlist = mongoose.model<IProfTAWishlist>("ProfTAWishlist", ProfTAWishlistSchema);

export default ProfTAWishlist;
