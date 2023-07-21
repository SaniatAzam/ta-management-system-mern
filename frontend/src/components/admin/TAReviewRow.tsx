import { Review } from "../../classes/Review";

const TAReviewRow = ({ review, fetchTAReviews }: { review: Review; fetchTAReviews: Function }) => {

    const reviewer = review.reviewer;
    const course = review.course;
    const rating = review.rating;
    const comment = review.comment;

    return (

        <tr className="body">
            <td className="column0">{reviewer}</td>
            <td className="column1">{course}</td>
            <td className="column2">{comment}</td>
            <td className="column3">{rating}</td>
        </tr>

    );
};

export default TAReviewRow;