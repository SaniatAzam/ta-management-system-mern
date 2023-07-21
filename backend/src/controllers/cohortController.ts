import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import TACohort from "../models/TACohort";
import Course from "../models/Course";
import PerformanceLog from "../models/PerformanceLog";
import { parse } from 'csv-string';

// @Desc Get all users
// @Route /api/cohort
// @Method GET
export const getAllCohorts = asyncHandler(async (req: Request, res: Response) => {
    const cohorts = await TACohort.find({});
    res.status(200).json({
        cohorts
    });
});


const findCourseId = async (course: String, term: String, year: string) => {
    let courseObj = await Course.findOne({
        courseNumber: course,
        term: term,
        year: parseInt(year),
    });
    return courseObj

}

// @Desc Add new TA to cohort
// @Route /api/cohort/addTa
// @Method POST
//for testing purposes
export const addTa = asyncHandler(async (req: Request, res: Response) => {
    const { term_year, student_ID, legal_name, email, degree, supervisor_name, priority, date_applied, courses_applied_for_list, open_to_other_courses, phone } = req.body;
    const ta_name = legal_name.split(" ");
    const ta_user = await User.findOne({
        firstName: ta_name[0],
        lastName: ta_name[1],
        email: email
    });

    let courses: Promise<any>[] = [];
    const term_year_split = term_year.split(" ");
    const term = term_year_split[0]
    const year = term_year_split[1]

    console.log(term);
    console.log(year);
    console.log(courses_applied_for_list)
    courses_applied_for_list.forEach(async (course: string) => {
        console.log("IM HERER")
        let courseId = findCourseId(course, term, year)

        if (!courseId) {
            res.status(404);
            throw new Error("Course not found");
        } else {
            let id = courseId?.then((result) => result?.id);
            console.log(id)
            courses.push(id)
        }
    });

    let course_1 = courses_applied_for_list[0]
    let courseFinal = await Course.findOne({
        courseNumber: course_1,
        term: term,
        year: parseInt(year),
    });
    if (!courseFinal) {
        throw new Error("Wrong");
    }
    const ta = new TACohort({
        term_year: term_year,
        ta_user: ta_user,
        email: email,
        phone: phone,
        student_ID: student_ID,
        legal_name: legal_name,
        degree: degree,
        supervisor_name: supervisor_name,
        priority: priority,
        date_applied: date_applied,
        courses_applied_for_list: [courseFinal?.id],
        open_to_other_courses: open_to_other_courses,
    });
    ta.save();
    res.status(200).json({
        ta
    });
});

// @Desc Save multiple users
// @Route /api/cohort/upload
// @Method POST
export const registerCohortsFromFile = asyncHandler(async (req: Request, res: Response) => {
    const csv = req.file;
    if (csv) {
        const fileContent = parse(csv.buffer.toString('utf-8'));
        for (let record of fileContent) {
            let term_year = record[0].split(" ");
            let applied_courses = record[12].split(",");
            if (term_year.length != 2) {
                throw new Error(`the term year record "${term_year} is incorrectly formatted"`)
            }

            // assumption: applied_courses record of form "COMP XXX,COMP YYY,COMP ZZZ"
            // so applied courses of form [COMP XXX, COMP YYY, COMP ZZZ] 
            const courses = [];
            for (const course in applied_courses) {
                const courseObj = await Course.find({
                    courseNumber: course,
                    term: term_year[0],
                    year: term_year[1]
                });

                if (!courseObj) {
                    res.status(404);
                    throw new Error("User not found");
                } else {
                    courses.push(courseObj);
                }
            }
            const ta_name = record[1].split(" ");
            const ta_user = await User.findOne({
                firstName: ta_name[0],
                lastName: ta_name[1],
                email: record[4]
            });

            if (!ta_user) {
                throw new Error(`"TA ${record[1]} with email ${record[4]} not found in User database"`)
            } else {
                const ta = new TACohort({
                    term_year: record[0],
                    ta_user: ta_user,
                    student_ID: record[2],
                    legal_name: record[3],
                    degree: record[5],
                    supervisor_name: record[6],
                    priority: record[7],
                    hours: record[8],
                    date_applied: record[9],
                    location: record[10],
                    phone: record[11],
                    courses_applied_for_list: courses,
                    open_to_other_courses: record[13],
                    notes: record[14]
                });
                ta.save(); // can be made concurrent
            }
        }
    } else {
        res.status(500);
        throw new Error("File upload unsuccessful.");
    }
    res.status(200).json({});
});


// @Desc Get User by ID
// @Route /api/cohort/:id
// @Method GET
export const getCohortByID = asyncHandler(async (req: Request, res: Response) => {
    const ta = await TACohort.findById({ _id: req.params.id });
    if (!ta) {
        res.status(404);
        throw new Error("TA not found");
    }
    res.status(200).json({
        ta
    });
});

// @Desc Get TA by user ID
// @Route /api/cohort/:uid
// @Method GET
export const getCohortByUserID = asyncHandler(async (req: Request, res: Response) => {
    const ta = await TACohort.findOne({ ta_user: req.params.id });
    if (!ta) {
        res.status(404);
        throw new Error("TA with assoicated user not found");
    }
    res.status(200).json({
        ta
    });
});

// @Desc Get Performance logs for a TA
// @Route /api/cohort/perflogs
// @Method GET
export const getTAPerfLogs = asyncHandler(async (req: Request, res: Response) => {
    const { ta_email } = req.body;
    const ta = await TACohort.findOne({ email: ta_email });

    if (!ta) {
        res.status(404);
        throw new Error("TA not found");
    } else {
        const perf_logs = await PerformanceLog.find({
            ta_email: ta_email
        });
        if (!perf_logs) {
            res.status(404);
            throw new Error(`No Performance logs assoicated with given for TA: ${ta_email}`);
        } else {
            res.status(200).json({
                perf_logs
            });
        }
    }
});

// @Desc Delete cohort by ID
// @Route /api/cohort/delete/:student_ID
// @Method DELETE
export const deleteCohort = asyncHandler(async (req: Request, res: Response) => {
    const { student_ID } = req.body;

    let ta = await TACohort.findOne({ student_ID });
    if (!ta) {
        res.status(404);
        throw new Error("User not found");
    }
    await TACohort.findOneAndDelete({ student_ID });
    res.status(201).json({});
});