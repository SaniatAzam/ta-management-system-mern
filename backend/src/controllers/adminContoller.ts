import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import TACohort from "../models/TACohort";
import Course from "../models/Course";

// @Desc Add Courses
// @Route /api/course/addCourseTA
// @Method PUT
export const addCourseTA = asyncHandler(async (req: Request, res: Response) => {
  const { courseNumber, term, year, ta_name, prof_name } = req.body;
  let profFirstName = prof_name.split(" ")[0];
  let profLastName = prof_name.split(" ")[1];
  let courseInstructor = await User.findOne({ firstName: profFirstName, lastName: profLastName }).select("-password");

  if (!courseInstructor) {
    res.status(404);
    throw new Error(
      "Instructor not found in the database! Add user and continue."
    );
  }

  let course = await Course.findOne({ courseInstructor: courseInstructor, courseNumber: courseNumber, term: term, year: year });


  let TA = await TACohort.findOne({ legal_name: ta_name });

  const courseWithTA = await Course.findByIdAndUpdate(course?._id, {
    assignedTAs: [TA]
  })

  res.status(201).json({
    id: courseWithTA?._id,
    assignedTAs: courseWithTA?.assignedTAs,
    courseNumber: courseWithTA?.courseNumber,
    instructor: courseWithTA?.courseInstructor
  });
});
