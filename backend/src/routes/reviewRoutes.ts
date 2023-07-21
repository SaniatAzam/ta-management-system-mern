import express from 'express';
import { getAllReviews, addReview, getTAReviews } from '../controllers/reviewController';

const router = express.Router();

router.route("/").get(getAllReviews);
router.route("/add").post(addReview);
router.route("/:id").get(getTAReviews);

export default router;