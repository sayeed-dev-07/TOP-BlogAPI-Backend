import 'dotenv/config';
import express from "express";
import cors from 'cors';
import { loginControl, registerUserControl } from "./controllers/user.js";
import { verifyAuth } from './middlewares/jwtAuth.js';

import { postRoutes } from './routes/post.js';


const app = express()

app.use(cors());
app.use(express.json());

// for test only 
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello From the main page"
    })
})

app.get('/register', (req, res) => {
    res.json({
        message: 'hello from register page'
    })
})

app.post('/register', registerUserControl)

app.get('/login', (req, res) => {
    res.json({
        message: 'hello from login page'
    })
})
app.post('/login', loginControl)

app.use('/posts', verifyAuth, postRoutes)
app.listen(3000, () => {
    console.log('Running Sucessfully on port 3000');
})