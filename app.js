import express from "express";
import cors from 'cors';

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
app.get('/:anything', (req, res) => {
    res.status(200).json({
        message: `hello from ${req.params.anything}`
    })
})

app.get('/test', (req, res) => {
    res.status(200).json({
        message: "Hello From the test page"
    })
})


app.listen(3000, () => {
    console.log('Running Sucessfully on port 3000');
})