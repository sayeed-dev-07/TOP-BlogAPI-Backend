import { Router } from "express";
import { createPost, deletePostControl, editPost } from "../controllers/post.js";
import { isAdmin } from "../middlewares/adminAuth.js";

const postRoutes = Router()

postRoutes.get('/', (req, res) => {
    res.json({
        message: 'hello from post routes'
    })
})

postRoutes.post('/', isAdmin, createPost)
postRoutes.get('/edit', isAdmin, (req, res) => {
    res.json({
        message: 'hello from post edit page'
    })
})
postRoutes.patch('/edit/:postId', isAdmin, editPost)
postRoutes.delete('/delete/:postId', isAdmin, deletePostControl)




export { postRoutes }