
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Course from "../models/Course";
import User from "../models/User";
import TACohort from "../models/TACohort";
import { parse } from 'csv-string';

// @Desc Get all Courses
// @Route /api/course
// @Method GET
export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await Course.find({});
  res.status(200).json({ courses });
});

// @Desc Get Course by ID
// @Route /api/courses/:id
// @Method GET
export const getCourseByID = asyncHandler(async (req: Request, res: Response) => {

  const course = await Course.findById({ _id: req.params.id });
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.status(200).json({
    course
  });
});

// @Desc Get Course by Course Num
// @Route /api/courses/:courseNum
// @Method GET
export const getCourseByCourseNum = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.params.courseNum)
  const course = await Course.find({ courseNumber: req.params.courseNum });
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.status(200).json({
    course
  });
});



// @Desc Save multiple courses
// @Route /api/course/upload
// @Method POST
export const registerCourseFromFile = asyncHandler(async (req: Request, res: Response) => {
  const csv = req.file;
  if (csv) {
    const fileContent = parse(csv.buffer.toString('utf-8'));
    for (let record of fileContent) {
      const instructorEmail = record[5];
      let courseInstructor = await User.findOne({ email: instructorEmail }).select("-password");
      if (!courseInstructor) {
        res.status(404);
        console.log("Instructor not found in the database! Skipping row.");
      } else {
        const course = new Course({
          courseName: record[0],
          courseDesc: record[1],
          term: record[2],
          year: record[3],
          courseNumber: record[4],
          courseInstructor: courseInstructor,
          courseType: record[5],
          taQuota: record[6],

        });
        course.save(); // can be made concurrent
      }
    }
  } else {
    res.status(500);
    throw new Error("File upload unsuccessful.");
  }
  res.status(200).json({});
});


// @Desc Add Courses
// @Route /api/course/add
// @Method POST
export const addCourses = asyncHandler(async (req: Request, res: Response) => {
  const { courseName, courseDesc, term, year, courseNumber, instructorEmail } = req.body;
  let courseInstructor = await User.findOne({ 'email': instructorEmail }).select("-password");
  if (!courseInstructor) {
    res.status(404);
    throw new Error("Instructor not found in the database! Add user and continue.");
  }

  const course = new Course({ courseName, courseDesc, term, year, courseNumber, courseInstructor });
  await course.save();
  res.status(201).json({
    id: course._id,
    courseName: course.courseName,
    courseDesc: course.courseDesc,
    term: course.term,
    year: course.year,
    courseNumber: course.courseNumber,
    instructor: course.courseInstructor
  });
});

// @Desc Delete Course
// @Route /api/course/:id
// @Method DELETE
export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {

  const { courseName, courseDesc, term, year, courseNumber, instructor } = req.body;


  let course = await Course.findOneAndDelete({
    'courseDesc': courseDesc,
    'courseNumber': courseNumber,
    'courseName': courseName,
    'term': term,
    'year': year
    //'courseInstructor': instructor,
  });
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(201).json({});
});

// @Desc Add TA to a Course
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
  let course = await Course.findOne({ courseInstructor: courseInstructor._id, courseNumber: courseNumber, term: term, year: year });
  //let courseTAs = course?.assignedTAs;


  let TA = await TACohort.findOne({ legal_name: ta_name });
  //courseTAs?.push(TA?._id)

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


// @Desc Add TA to a Course
// @Route /api/course/addTAQuota
// @Method PUT
export const addTAQuota = asyncHandler(async (req: Request, res: Response) => {
  const { courseNumber, term, year, ta_quota, prof_name } = req.body;
  let profFirstName = prof_name.split(" ")[0];
  let profLastName = prof_name.split(" ")[1];
  let courseInstructor = await User.findOne({ firstName: profFirstName, lastName: profLastName }).select("-password");

  if (!courseInstructor) {
    res.status(404);
    throw new Error(
      "Instructor not found in the database! Add user and continue."
    );
  }
  let course = await Course.findOne({ courseInstructor: courseInstructor._id, courseNumber: courseNumber, term: term, year: year });
  //let courseTAs = course?.assignedTAs;


  //let TA = await TACohort.findOne({ legal_name: ta_name });
  //courseTAs?.push(TA?._id)

  const courseWithTA = await Course.findByIdAndUpdate(course?._id, {
    taQuota: ta_quota
  })

  res.status(201).json({
    id: courseWithTA?._id,
    assignedTAs: courseWithTA?.taQuota,
    courseNumber: courseWithTA?.courseNumber,
    instructor: courseWithTA?.courseInstructor
  });
});


// @Desc Assign TA to a Course (with course id given and taUserId)
// @Route /api/course/addCourseTAByID
// @Method PUT
export const addCourseTAByID = asyncHandler(async (req: Request, res: Response) => {
  const { course_id, taUserID } = req.body;
  console.log(course_id);
  console.log(taUserID);


  let TA = await TACohort.findById({ _id: taUserID });

  const courseWithTA = await Course.findByIdAndUpdate(course_id,
    {
      $addToSet: {
        assignedTAs: taUserID,
      },
    },
    { new: true }
  );

  console.log(courseWithTA?.assignedTAs);
  res.status(201).json({
    id: courseWithTA?._id,
    assignedTAs: courseWithTA?.assignedTAs,
    courseNumber: courseWithTA?.courseNumber,
    instructor: courseWithTA?.courseInstructor
  });
});

// @Desc Unassign TA from a Course (with course id given and taUserId)
// @Route /api/course/aremoveCourseTAByID
// @Method PUT
export const removeCourseTAByID = asyncHandler(async (req: Request, res: Response) => {
  const { course_id, taUserID } = req.body;
  console.log(course_id);
  console.log(taUserID);


  let TA = await TACohort.findById({ _id: taUserID });

  const courseWithTA = await Course.findByIdAndUpdate(course_id,
    {
      $pullAll: {
        assignedTAs: taUserID,
      },
    },
    { new: true },
    (err, usr) => {
      if (err) {
        res.status(500).send(err);
      }
      if (usr) {
        res.send(usr);
      } else {
        res.status(400).send("Bad request - User not found");
      }
    }

  );

  console.log(courseWithTA?.assignedTAs);
  res.status(201).json({
    id: courseWithTA?._id,
    assignedTAs: courseWithTA?.assignedTAs,
    courseNumber: courseWithTA?.courseNumber,
    instructor: courseWithTA?.courseInstructor
  });
});

// @Desc Remove TA fromo a Course
// @Route /api/course/removeCourseTA
// @Method PUT
export const removeCourseTA = asyncHandler(async (req: Request, res: Response) => {
  const { course_id, taUserID, prof_name } = req.body;
  let profFirstName = prof_name.split(" ")[0];
  let profLastName = prof_name.split(" ")[1];
  let courseInstructor = await User.findOne({ firstName: profFirstName, lastName: profLastName }).select("-password");

  if (!courseInstructor) {
    res.status(404);
    throw new Error(
      "Instructor not found in the database! Add user and continue."
    );
  }

  let course = await Course.findOne({ _id: course_id });


  let TA = await TACohort.findById({ _id: taUserID });

  const courseWithTA = await Course.findByIdAndDelete(course?._id, {
    assignedTAs: [TA]
  })

  res.status(201).json({
    id: courseWithTA?._id,
    assignedTAs: courseWithTA?.assignedTAs,
    courseNumber: courseWithTA?.courseNumber,
    instructor: courseWithTA?.courseInstructor
  });
});

