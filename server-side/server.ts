import express, { Express} from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

const app: Express = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const mongodb_url: string | undefined = process.env.MONGODB_URI;

if (!mongodb_url) {
    console.error('MONGODB_URL environment variable is not defined.');
    process.exit(1);
}

const dbConnect = mongoose.connect(mongodb_url);

dbConnect.then(() => {
    console.log('MongoDB connected successfully');
})
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });


app.use('/api', userRoutes);

const port: string | undefined = process.env.PORT;

app.listen(parseInt(port), () => {
    console.log(`Server listening on http://localhost:${port}/`);
});