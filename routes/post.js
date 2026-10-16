import { Router } from "express";
import { createPost } from "../controllers/post.js";

const postRoutes = Router()

postRoutes.get('/', (req, res) => {
    res.json({
        message: 'hello from post routes'
    })
})

postRoutes.post('/', createPost)

export { postRoutes }