import cors from 'cors';
import express from 'express';
import connectDB from "./config/db.config";
import userRoutes from './routes/userRoutes';
import profRoutes from './routes/profRoutes';
import courseRoutes from './routes/courseRoutes';
import reviewRoutes from './routes/reviewRoutes';
import cohortRoutes from './routes/cohortRoutes';
import studentRoutes from './routes/studentRoutes';

const app = express();
const port = 3000;

// Basic express setup
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/prof", profRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cohort", cohortRoutes);
app.use("/api/student", studentRoutes);


app.listen(port, () => {
    console.log('Backend is running on port: ' + port)
})

