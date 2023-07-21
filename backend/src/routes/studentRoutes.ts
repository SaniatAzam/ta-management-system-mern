import express from 'express';
import { getAllStudents, deleteStudent, addStudent } from '../controllers/studentController';

const router = express.Router();

router.route("/").get(getAllStudents);
router.route("/add").post(addStudent);
router.route("/delete").delete(deleteStudent);

export default router;