import express from 'express';
import { getAllCohorts, getCohortByID, registerCohortsFromFile, deleteCohort, getTAPerfLogs, addTa, getCohortByUserID } from '../controllers/cohortController';
import multer from "multer";
const upload = multer();

const router = express.Router();

router.route("/").get(getAllCohorts);
router.route("/:id").get(getCohortByID);
router.route("/:uid").get(getCohortByUserID);
router.route("/upload").post(upload.single("csvFile"), registerCohortsFromFile);
router.route("/addTa").post(addTa);
router.route("/perflogs").get(getTAPerfLogs);
router.route("/delete").delete(deleteCohort);

export default router;