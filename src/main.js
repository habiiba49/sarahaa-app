import './lib/db/mongoose.js';
import userRouter from './app/user/user.route.js';
import express, { Router } from 'express';
import cors from 'cors';
import { globalErrorHandeler } from './pkg/error/error.handeler.js';
import { correlationId } from './pkg/correlation/correlationId.js';
import cookieParser from 'cookie-parser';

export function createApp(){
    const app = express();

app.use((req, res, next) => {
    console.log(req.method, req.originalUrl);
    next();
})

app.use(cors({origin: 'http://localhost:4200'}));

//  لو هبعت الداتا في الفورم جيسون ف دي مش هتشتغل
//  بتشتغل مع ال  raw
app.use(express.json());
app.use(cookieParser());

app.use(correlationId);
console.log("app is running")
app.use('./api/user', userRouter);

app.use(globalErrorHandeler);

return app;
}
