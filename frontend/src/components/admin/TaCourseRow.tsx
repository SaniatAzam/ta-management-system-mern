const TaCourseRow = ({ course, fetchTAPerfLogs }: { course: String; fetchTAPerfLogs: Function }) => {

    return (
        <tr className="body">
            <td className="column0">{course}</td>
        </tr>

    );
};

export default TaCourseRow;