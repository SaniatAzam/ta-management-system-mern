import { useEffect, useState } from "react";
import "../../style/userTable.css";
import { Container } from "react-bootstrap";
import { TACohort } from "../../classes/TACohort";
import TAInfoRow from "./TAInfoRow";

const ManageTAInfo = () => {
    const [tas, setTAs] = useState<Array<TACohort>>([]);

    const fetchAllTAs = async () => {
        try {
            const res = await fetch("http://127.0.0.1:3000/api/cohort");
            const data = await res.json();
            const all_tas = [];
            for (const ta of data.cohorts) {
                const formatted_application_date = new Date(ta.date_applied);

                let cohort = {
                    uuid: ta._id,
                    legal_name: ta.legal_name,
                    student_ID: ta.student_ID,
                    email: ta.email,
                    degree: ta.degree,
                    supervisor_name: ta.supervisor_name,
                    priority: ta.priority,
                    date_applied: `${formatted_application_date.getFullYear()}/${formatted_application_date.getMonth()}/${formatted_application_date.getDay()}`,
                    phone: ta.phone,
                    courses_applied_for_list: ta.courses_applied_for_list,
                    open_to_other_courses: ta.open_to_other_courses,
                }
                all_tas.push(cohort);
            }
            setTAs(all_tas);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllTAs();
    }, []);

    return (
        <div>
            <Container className="mt-3">
                <div className="rowC">
                    <h2 style={{ marginBottom: "20px" }}>All TA Reports</h2>
                </div>
                <div id="profTable">
                    <table>
                        <thead>
                            <tr>
                                <th className="column0">Name</th>
                                <th className="column1">Email</th>
                                <th className="column2">Supervisor</th>
                                <th className="column3">Info and History</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tas.map((ta: TACohort, i: number) => (
                                <TAInfoRow key={i} ta={ta} fetchAllTAs={fetchAllTAs} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </div>
    );
};

export default ManageTAInfo;
