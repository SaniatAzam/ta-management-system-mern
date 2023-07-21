import express from 'express';
import { getAllProfs, addProfs, registerProfFromFile, deleteProf, addToWishlist, addToPerformanceLog, getWishList, getTAWishlist, getAllWishlist, getAllPerfLogs, addToTimeSheet, getTimeSheet, getTAPerfLogs } from '../controllers/profController';
import multer from "multer";

const upload = multer();
const router = express.Router();

router.route("/").get(getAllProfs);
router.route("/add").post(addProfs);
router.route("/upload").post(upload.single("csvFile"), registerProfFromFile);
router.route("/addToWishlist").post(addToWishlist);
router.route("/getWishlist").get(getWishList);
router.route("/getAllWishlist").get(getAllWishlist);
router.route("/getTAWishlist").get(getTAWishlist);
router.route("/addToPerformanceLog").post(addToPerformanceLog);
router.route("/addToTimeSheet").post(addToTimeSheet);
router.route("/getTimeSheet").get(getTimeSheet);
router.route("/getAllPerfLogs").get(getAllPerfLogs);
router.route("/getTAPerfLogs").get(getTAPerfLogs);
router.route("/delete").delete(deleteProf);

export default router;