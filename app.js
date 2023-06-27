require("dotenv").config();
require("express-async-errors");

const path = require("path")

//security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//connect db
const connectDB = require("./db/connect");

// import routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// custom error middlewares
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

// auth middleware
const authMiddleware = require("./middleware/auth");

const express = require("express")


const app = express();
app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(express.json());

// security middlewares
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        msg: 'Too many requests from this IP, please try again after 15 mins'
    }
}))
app.use(helmet());
app.use(cors());
app.use(xss());


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs/', authMiddleware, jobsRouter);

app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// custom middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)



const port = process.env.PORT || 3000;

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to db...')
        app.listen(port, console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()