import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Professor from "../models/Professor";
import Course from "../models/Course";
import User from "../models/User";
import { parse } from 'csv-string';
import ProfTAWishlist from "../models/ProfTAWishlist";
import PerformanceLog from "../models/PerformanceLog";
import TimeSheet from "../models/TimeSheet";

// @Desc Get all Profs
// @Route /api/prof
// @Method GET
export const getAllProfs = asyncHandler(async (req: Request, res: Response) => {
  const profs = await Professor.find({});
  res.status(200).json({
    profs
  });
});

// @Desc Get entire Wishlist
// @Route /api/prof/getAllWishlist
// @Method GET
export const getAllWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await ProfTAWishlist.find({});
  res.status(200).json({
    wishlist
  });
});

// @Desc Get all wishlists associated with a TA
// @Route /api/prof/getTAWishlist
// @Method GET
export const getTAWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { ta_name } = req.query;
  const wishlists = await ProfTAWishlist.find({ TA_name: ta_name });
  res.status(200).json({
    wishlists
  });
});

// @Desc Get all Performance Logs for given TA
// @Route /api/prof/getTAPerfLogs
// @Method GET
export const getTAPerfLogs = asyncHandler(async (req: Request, res: Response) => {
  const { ta_name } = req.query;
  const perfLogs = await PerformanceLog.find({ ta_name: ta_name });
  res.status(200).json({
    perfLogs
  });
});

// @Desc Get entire All Performance Logs
// @Route /api/prof/getAllPerfLogs
// @Method GET
export const getAllPerfLogs = asyncHandler(async (req: Request, res: Response) => {
  const perfLogs = await PerformanceLog.find({});
  res.status(200).json({
    perfLogs
  });
});

// @Desc Get entire Wishlist
// @Route /api/prof/getTimeSheet
// @Method GET
export const getTimeSheet = asyncHandler(async (req: Request, res: Response) => {
  const timeSheet = await TimeSheet.find({});
  res.status(200).json({
    timeSheet
  });
});

// @Desc Save multiple profs
// @Route /api/prof/upload
// @Method POST
export const registerProfFromFile = asyncHandler(async (req: Request, res: Response) => {
  const csv = req.file;
  if (csv) {
    const fileContent = parse(csv.buffer.toString('utf-8'));
    for (let record of fileContent) {
      const professorEmail = record[0];
      const courseNumber = record[3];
      let instructor = await User.findOne({ email: professorEmail }).select("-password");
      let course = await Course.findOne({ courseNumber: courseNumber });
      if (!instructor || !course) {
        res.status(404);
        console.log("Instructor or course not found in the database! Skipping row.");
      } else {
        const prof = new Professor({
          professor: instructor,
          faculty: record[1],
          department: record[2],
          course: course
        });
        await prof.save();
      }
    }
  } else {
    res.status(500);
    throw new Error("File upload unsuccessful.");
  }
  res.status(200).json({});
});

// @Desc Add Professor
// @Route /api/prof/add
// @Method POST
export const addProfs = asyncHandler(async (req: Request, res: Response) => {
  const { professorEmail, faculty, department, courseNumber } = req.body;
  // Also think of the case when the email is not that of a prof, how can you handle it?
  let instructor = await User.findOne({ 'email': professorEmail }).select("-password");
  if (!instructor) {
    res.status(404);
    throw new Error("Instructor not found in the database! Add user and continue.");
  }

  let course = await Course.findOne({ courseNumber });
  if (!course) {
    res.status(404);
    throw new Error("Course not found in the database! Add course and continue.");
  }

  const prof = new Professor({
    professor: instructor,
    faculty: faculty,
    department: department,
    course: course
  });
  await prof.save();
  res.status(201).json({
    id: prof._id,
    instructor: prof.professor,
    faculty: prof.faculty,
    term: prof.department,
    course: prof.course,
  });
});


// @Desc Delete Professor
// @Route /api/prof/delete
// @Method POST
export const deleteProf = asyncHandler(async (req: Request, res: Response) => {

  const { profDept, profEmail, profFac, profFname, profLname } = req.body;

  let profUser = await User.findOne({
    'firstName': profFname,
    'lastName': profLname,
    'email': profEmail
  });

  if (profUser) {
    let deletedProf = await Professor.findOneAndDelete({
      'professor': profUser,
      'faculty': profFac,
      'department': profDept,
    });

    if (!deleteProf) {
      res.status(404);
      throw new Error("Professor to delete not found in database.");
    }
  } else {
    res.status(404);
    throw new Error("User associated with Professor object not found.");
  }

  res.status(201).json({});
})


// @Desc Add TA to wishlist 
// @Route /api/prof/addToWishlist
// @Method POST
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { term_year_this_is_for, course_num, prof_first_name, prof_last_name, TA_name } = req.body;
  // Also think of the case when the email is not that of a prof, how can you handle it?
  let instructor = await User.findOne({ firstName: prof_first_name, lastName: prof_last_name }).select("-password");
  if (!instructor) {
    res.status(404);
    throw new Error(
      "Instructor not found in the database! Add user and continue."
    );
  }

  let course = await Course.findOne({ courseNumber: course_num });
  if (!course) {
    res.status(404);
    throw new Error(
      "Course not found in the database! Add course and continue."
    );
  }

  let taFirstName = TA_name.split(" ")[0];
  let taLastName = TA_name.split(" ")[1];
  let ta = await User.findOne({ firstName: taFirstName, lastName: taLastName }).select("-password");
  if (!ta) {
    res.status(404);
    throw new Error(
      "TA not found in the database! Add user and continue."
    );
  }

  const profWishlist = new ProfTAWishlist({
    TA_name: TA_name,
    prof_name: prof_first_name + " " + prof_last_name,
    term_year_this_is_for: term_year_this_is_for,
    course_num: course_num,
  });
  await profWishlist.save();

  res.status(201).json({
    id: profWishlist._id,
    prof_name: profWishlist.prof_name,
    TA_name: profWishlist.TA_name,
    term_year_this_is_for: profWishlist.term_year_this_is_for,
    course_num: profWishlist.course_num,
  });
});

// @Desc Pseudo-Get with Post GetWishList for a certain course
// @Route /api/prof/getWishList
// @Method POST
export const getWishList = asyncHandler(async (req: Request, res: Response) => {
  const { term_year_this_is_for, prof_name, course_num } = req.body;
  console.log("In getWishList - email:");
  console.log(prof_name);

  const wishList = await ProfTAWishlist.find({
    'term_year_this_is_for': term_year_this_is_for,
    'course_num': course_num,
    'prof_name': prof_name,
  });
  if (!wishList) {
    res.status(404);
    console.log("No Wish List Made Yet.")
  } else {
    res.status(200).json({ wishList });
  }
});


// @Desc Add Comment about TA to performance log
// @Route /api/prof/addToPerformanceLog
// @Method POST

export const addToPerformanceLog = asyncHandler(async (req: Request, res: Response) => {
  const { term_year, course_num, ta_name, comment, prof_first_name, prof_last_name } = req.body;
  // Also think of the case when the email is not that of a prof, how can you handle it?
  let instructor = await User.findOne({ firstName: prof_first_name, lastName: prof_last_name }).select("-password");
  if (!instructor) {
    res.status(404);
    throw new Error(
      "Instructor not found in the database! Add user and continue."
    );
  }

  let course = await Course.findOne({ courseNumber: course_num });
  if (!course) {
    res.status(404);
    throw new Error(
      "Course not found in the database! Add course and continue."
    );
  }

  let taFirstName = ta_name.split(" ")[0];
  let taLastName = ta_name.split(" ")[1];
  let ta = await User.findOne({ firstName: taFirstName, lastName: taLastName }).select("-password");
  if (!ta) {
    res.status(404);
    throw new Error(
      "TA not found in the database! Add user and continue."
    );
  }

  const performanceLog = new PerformanceLog({
    ta_name: ta_name,
    professor_name: prof_first_name + " " + prof_last_name,
    term_year: term_year,
    course_num: course_num,
    comment: comment
  });
  await performanceLog.save();

  res.status(201).json({
    id: performanceLog._id,
    prof_name: performanceLog.professor_name,
    ta_name: performanceLog.ta_name,
    term_year: performanceLog.term_year,
    comment: performanceLog.comment,
  });
});

// @Desc Add Information about office hours to TimeSheet schema
// @Route /api/prof/addToTimeSheet
// @Method POST
export const addToTimeSheet = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      first_name,
      last_name,
      course_num,
      office_hours_from,
      office_hours_to,
      office_hours_day,
      duties,
      location
    } = req.body;
    // Also think of the case when the email is not that of a prof, how can you handle it?
    let user = await User.findOne({
      firstName: first_name,
      lastName: last_name,
    }).select("-password");
    if (!user) {
      res.status(404);
      throw new Error(
        "User not found in the database! Add user and continue."
      );
    }

    let course = await Course.findOne({ courseNumber: course_num });
    if (!course) {
      res.status(404);
      throw new Error(
        "Course not found in the database! Add course and continue."
      );
    }

    const timeSheetEntry = new TimeSheet({
      user: user,
      course: course,
      office_hours_from: office_hours_from,
      office_hours_to: office_hours_to,
      office_hours_day: office_hours_day,
      office_location: location,
      duties: duties
    });
    await timeSheetEntry.save();

    res.status(201).json({
      id: timeSheetEntry._id,
      course: timeSheetEntry.course.courseName,
      user_name: timeSheetEntry.user.firstName + " " + user.lastName,
      office_hours_from: timeSheetEntry.office_hours_from,
      office_hours_to: timeSheetEntry.office_hours_to,
      office_hours_day: timeSheetEntry.office_hours_day,
      location: timeSheetEntry.office_location,
      duties: timeSheetEntry.duties
    });
  }
);