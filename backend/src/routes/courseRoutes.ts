import express from 'express';
import { removeCourseTAByID, addCourseTAByID, getAllCourses, getCourseByID, addCourses, registerCourseFromFile, deleteCourse, addCourseTA, getCourseByCourseNum, addTAQuota } from '../controllers/courseController';
import multer from "multer";
const upload = multer();

const router = express.Router();

router.route("/").get(getAllCourses);
router.route("/:id").get(getCourseByID);
router.route("/getCourseByCourseNum/:courseNum").get(getCourseByCourseNum);
router.route("/add").post(addCourses);
router.route("/addTA").put(addCourseTA);
router.route("/addQuota").put(addTAQuota);
router.route("/addCourseTAByID").put(addCourseTAByID);
router.route("/removeCourseTAByID").put(removeCourseTAByID);
router.route("/upload").post(upload.single("csvFile"), registerCourseFromFile);
router.route("/delete").delete(deleteCourse);

export default router;