import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Review from "../models/Review";
import User from "../models/User";
import Course from "../models/Course";
import TACohort from "../models/TACohort";


// @Desc Get all Reviews
// @Route /api/review
// @Method GET
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({});
  res.status(200).json({reviews});
});

// @Desc Get TA assoicated Reviews
// @Route /api/review/:id
// @Method GET
export const getTAReviews = asyncHandler(async (req: Request, res: Response) => {
  const { ta } = req.query;
  const reviews = await Review.find({ta: ta});
  res.status(200).json({reviews});
});


// @Desc Add Reviews
// @Route /api/course/add
// @Method POST
export const addReview = asyncHandler(async (req: Request, res: Response) => {
    
  const { courseNumber, term, year, taEmail, reviewerEmail, rating, comment } = req.body;

  let course = await Course.findOne({ 
    'courseNumber': courseNumber, 
    'term' : term, 
    'year' : year 
  });

  if (!course) {
      res.status(404);
      throw new Error("Course not found in the database!");
  }

  let user = await User.findOne({ 
    'email' : taEmail, 
    // 'userType': "ta"
  }).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found in the database!");
  }

  let ta = await TACohort.findOne({'ta_user': user._id});
  if (!ta) {
    res.status(404);
    throw new Error("TA not found in the database! User might not be a TA.");
  }

  let reviewerUser = await User.findOne({'email': reviewerEmail});
  if (!reviewerUser) {
    res.status(404);
    throw new Error("No user found");
  } else {
    console.log("got here")
  }
  
  const review = new Review({
    ta: ta, 
    reviewer: reviewerUser, 
    course: course, 
    rating: rating, 
    comment: comment
  });
  await review.save();
  res.status(201).json({
      id: review._id,
      ta: review.ta,
      reviewer: review.reviewer,
      course: review.course,
      rating: review.rating,
      comment: review.comment
  });
});

// @Desc Delete Review
// @Route /api/course/:id
// @Method DELETE
// export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    
//   const {  } = req.body;
  
//   let review = await Review.findOne({
//     // TO DO
//   });

//   if (review) {
//       let deletedRev = await Review.findOneAndDelete({ 
//         // TO DO
//       });

//       if(!deleteRev) {
//           res.status(404);
//           throw new Error("Review to delete not found in database.");
//       }
//   } else {
//       res.status(404);
//       throw new Error("Review associated with User object not found.");
//   }

//   res.status(201).json({});
// })