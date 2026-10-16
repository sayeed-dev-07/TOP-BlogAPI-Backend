import { Router } from "express";
import { createPostControl, deletePostControl, editPostControl } from "../controllers/post.js";
import { isAdmin } from "../middlewares/adminAuth.js";
import { commentRoute } from "./comment.js";


const postRoutes = Router()

postRoutes.get('/', (req, res) => {
    res.json({
        message: 'hello from post routes'
    })
})

postRoutes.post('/', isAdmin, createPostControl)
postRoutes.get('/edit', isAdmin, (req, res) => {
    res.json({
        message: 'hello from post edit page'
    })
})
postRoutes.patch('/:postId/edit', isAdmin, editPostControl)
postRoutes.delete('/:postId/delete', isAdmin, deletePostControl)
postRoutes.use('/:postId/comment', commentRoute);




export { postRoutes }