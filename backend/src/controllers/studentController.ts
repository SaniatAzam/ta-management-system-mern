import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Student from "../models/Student";
import Course from "../models/Course";
import User from "../models/User";

// @Desc Get all Profs
// @Route /api/student
// @Method GET
export const getAllStudents = asyncHandler(async (req: Request, res: Response) => {
  console.log("IM HERE")
  const students = await Student.find({});
  res.status(200).json({
    students
  });
});

// @Desc Add Student
// @Route /api/student/add
// @Method POST
export const addStudent = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.body)
  const { studentEmail, studentID, course1, course2, course3, course4, course5, course6 } = req.body;
  console.log(course1, course2, course3, course4, course5, course6);
  let student = await User.findOne({ 'email': studentEmail }).select("-password");
  if (!student) {
    res.status(404);
    throw new Error("Student not found in the database! Add user and continue.");
  }

  let course_array = []
  if (course1 !== undefined) {
    let firstCourse = await Course.findOne({ courseNumber: course1 });
    if (!firstCourse && course1 !== " ") {
      res.status(404);
      throw new Error("Course not found in the database! Add course and continue.");
    } else if (course1 !== " ") {
      console.log(firstCourse)
      course_array.push(firstCourse)
    }
  }
  if (course2 !== undefined) {
    let secondCourse = await Course.findOne({ courseNumber: course2 });
    console.log(secondCourse);
    if (!secondCourse && course2 !== " ") {
      res.status(404);
      throw new Error(
        "Course not found in the database! Add course and continue."
      );
    } else if (course2 !== " ") {
      console.log(secondCourse);
      course_array.push(secondCourse);
    }
  }
  if (course3 !== undefined) {
    let thirdCourse = await Course.findOne({ courseNumber: course3 });
    if (!thirdCourse && course3 !== " ") {
      res.status(404);
      throw new Error(
        "Course not found in the database! Add course and continue."
      );
    } else if (course3 !== " ") {
      console.log(thirdCourse);
      course_array.push(thirdCourse);
    }
  }

  if (course4 !== undefined) {
    let fourthCourse = await Course.findOne({ courseNumber: course4 });
    if (!fourthCourse && course4 !== " ") {
      res.status(404);
      throw new Error(
        "Course not found in the database! Add course and continue."
      );
    } else if (course4 !== " ") {
      console.log(fourthCourse);
      course_array.push(fourthCourse);
    }
  }
  if (course5 !== undefined) {
    let fifthCourse = await Course.findOne({ courseNumber: course5 });
    if (!fifthCourse && course5 !== " ") {
      res.status(404);
      throw new Error(
        "Course not found in the database! Add course and continue."
      );
    } else if (course5 !== " ") {
      console.log(fifthCourse);
      course_array.push(fifthCourse);
    }
  }

  if (course6 !== undefined) {
    let sixthCourse = await Course.findOne({ courseNumber: course6 });
    if (!course6 && !sixthCourse && course6 !== " ") {
      res.status(404);
      throw new Error(
        "Course not found in the database! Add course and continue."
      );
    } else if (course6 !== " ") {
      console.log(sixthCourse);
      course_array.push(sixthCourse);
    }
  }

  const stud = new Student({
    student: student,
    studentID: studentID,
    courses: course_array
  });

  await stud.save();
  res.status(201).json({
    id: stud._id,
    studentID: stud.studentID,
    courses: course_array
  });
});

export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {

  const { studentFname, studentLname, studentEmail, studentID } = req.body;

  let studentUser = await User.findOne({
    'firstName': studentFname,
    'lastName': studentLname,
    'email': studentEmail
  });

  if (studentUser) {
    let deletedStudent = await Student.findOneAndDelete({
      'student': studentUser,
      'studentID': studentID,
    });

    if (!deletedStudent) {
      res.status(404);
      throw new Error("Student to delete not found in database.");
    }
  } else {
    res.status(404);
    throw new Error("User associated with Student object not found.");
  }

  res.status(201).json({});
})