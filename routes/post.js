import { Router } from "express";
import { createPost, deletePostControl, editPost } from "../controllers/post.js";

const postRoutes = Router()

postRoutes.get('/', (req, res) => {
    res.json({
        message: 'hello from post routes'
    })
})

postRoutes.post('/', createPost)
postRoutes.get('/edit', (req, res) => {
    res.json({
        message: 'hello from post edit page'
    })
})
postRoutes.patch('/edit/:postId', editPost)
postRoutes.delete('/delete/:postId', deletePostControl)




export { postRoutes }