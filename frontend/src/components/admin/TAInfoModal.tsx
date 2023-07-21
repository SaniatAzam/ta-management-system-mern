import React from "react";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { PerformanceLog } from "../../classes/PerformanceLog";
import { Wishlist } from "../../classes/Wishlist";
import { Review } from "../../classes/Review";
import PerfLogsRow from "./PerfLogsRow";
import TaCourseRow from "./TaCourseRow";
import WishlistMembershipRow from "./WishlistMembershipRow";
import TAReviewRow from "./TAReviewRow";
import "../../style/userTable.css";

function TAInfoModal({ ta }) {

    const [perfLogs, setPerfLogs] = React.useState<Array<PerformanceLog>>([]);
    const [taCourses, setTaCourses] = React.useState<Array<String>>([]);
    const [wishlistMemberships, setWishlistMemberships] = React.useState<Array<Wishlist>>([]);
    const [taReviews, setTaReviews] = React.useState<Array<Review>>([]);
    const [showDetails, setShowDetails] = useState(false);
    const [avgRating, setAvgRating] = React.useState<number>();

    const fetchTAPerfLogs = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:3000/api/prof/getTAPerfLogs?ta_name=${ta.legal_name}`);
            const data = await res.json();
            const all_perf_logs = [];

            for (const perfdata of data.perfLogs) {
                let perflog = {
                    ta_name: ta.legal_name,
                    ta_email: ta.email,
                    term_year: perfdata.term_year,
                    course_num: perfdata.course_num,
                    comment: perfdata.comment,
                    professor_name: perfdata.professor_name,
                    createdAt: perfdata.createdAt,
                }

                all_perf_logs.push(perflog);
            }
            setPerfLogs(all_perf_logs);

        } catch (err) {
            console.log(err);
        }
    };

    const fetchTACourses = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:3000/api/course/`);
            const data = await res.json();
            const all_courses = []
            for (const course of data.courses) {
                try {
                    const course_tas = course.assignedTAs;
                    const hasTA = course_tas.some(x => x === ta.uuid);
                    console.log(hasTA);
                    if (hasTA) {
                        all_courses.push(course.courseNumber);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            setTaCourses(all_courses);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchTAWishlistMembership = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:3000/api/prof/getTAWishlist?ta_name=${ta.legal_name}`);
            const data = await res.json();
            const wishlist_items = []
            for (const wishlist of data.wishlists) {
                let wl = {
                    term_year_this_is_for: wishlist.term_year_this_is_for,
                    course_num: wishlist.course_num,
                    prof_name: wishlist.prof_name,
                    TA_name: wishlist.TA_name,
                }
                wishlist_items.push(wl);
            }
            setWishlistMemberships(wishlist_items);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchTAReviews = async () => {
        let total_ratings = 0;
        let cum_ratings = 0;
        try {
            const res = await fetch(`http://127.0.0.1:3000/api/review/getTAReviews?ta=${ta.uuid}`);
            console.log(res);
            console.log(ta.uuid);
            const data = await res.json();
            console.log(data);
            const all_ta_reviews = [];
            for (const review of data.reviews) {
                const reveiewer_user_res = await fetch("http://127.0.0.1:3000/api/users/" + review.reviewer);
                const reviewer_data = await reveiewer_user_res.json();
                const reviewer = reviewer_data.user;
                const reviewer_name = `${reviewer.firstName} ${reviewer.lastName}`
                const course_res = await fetch("http://127.0.0.1:3000/api/course/" + review.course);
                const course_data = await course_res.json();
                const course = course_data.course.courseNumber;
                let rev = {
                    ta_uuid: review.ta,
                    reviewer: reviewer_name,
                    course: course,
                    rating: review.rating,
                    comment: review.comment,
                }
                total_ratings += 1;
                cum_ratings += +review.rating;

                all_ta_reviews.push(rev);
            }

            setTaReviews(all_ta_reviews);
            setAvgRating(cum_ratings / total_ratings);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTAPerfLogs();
        fetchTACourses();
        fetchTAWishlistMembership();
        fetchTAReviews();
    }, []);

    return (
        <div>
            <button className="btn btn-secondary" onClick={() => setShowDetails(true)}>
                <OpenInFullIcon />
            </button>

            <Modal show={showDetails} onHide={() => setShowDetails(false)} dialogClassName="modal-lg" aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">{ta.legal_name} - Average Rating {avgRating}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>Cohort Information</h1>
                    <div id="profTable" >
                        <table>
                            <thead>
                                <tr>
                                    <th className="column0">Student ID</th>
                                    <th className="column1">Degree</th>
                                    <th className="column2">Priority</th>
                                    <th className="column3">TA Application Date (yyyy/mm/dd)</th>
                                    <th className="column4">Phone Number</th>
                                    <th className="column5">Courses Applied For</th>
                                    <th className="column6">Open to Other Courses?</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="body">
                                    <td className="column0">{ta.student_ID}</td>
                                    <td className="column1">{ta.degree}</td>
                                    <td className="column2">{String(ta.priority)}</td>
                                    <td className="column3">{ta.date_applied}</td>
                                    <td className="column4">{ta.phone}</td>
                                    <td className="column5">{ta.courses_applied_for_list.toString()}</td>
                                    <td className="column6">{String(ta.open_to_other_courses)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br></br><br></br>
                    <h1>Performance Logs</h1>
                    <div id="profTable" >
                        <table>
                            <thead>
                                <tr>
                                    <th className="column0">Term</th>
                                    <th className="column1">Course</th>
                                    <th className="column2">Comments</th>
                                    <th className="column3">Professor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {perfLogs.map((perfLog: PerformanceLog, i: number) => (
                                    <PerfLogsRow key={i} perfLog={perfLog} fetchTAPerfLogs={fetchTAPerfLogs} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <br></br><br></br>
                    <h1>Current Courses</h1>
                    <div id="profTable" >
                        <table>
                            <thead>
                                <tr>
                                    <th className="column0">Course</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taCourses.map((course: String, i: number) => (
                                    <TaCourseRow key={i} course={course} fetchTAPerfLogs={fetchTAPerfLogs} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <br></br><br></br>
                    <h1>Wishlist Membership</h1>
                    <div id="profTable" >
                        <table>
                            <thead>
                                <tr>
                                    <th className="column0">Professor</th>
                                    <th className="column1">Course</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wishlistMemberships.map((wishlist: Wishlist, i: number) => (
                                    <WishlistMembershipRow key={i} wishlist={wishlist} fetchTAWishlistMembership={fetchTAWishlistMembership} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <br></br><br></br>
                    <h1>Student Reviews</h1>
                    <div id="profTable" >
                        <table>
                            <thead>
                                <tr>
                                    <th className="column0">Reviewer</th>
                                    <th className="column1">Course</th>
                                    <th className="column2">Comment</th>
                                    <th className="column3">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taReviews.map((review: Review, i: number) => (
                                    <TAReviewRow key={i} review={review} fetchTAReviews={fetchTAReviews} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TAInfoModal;