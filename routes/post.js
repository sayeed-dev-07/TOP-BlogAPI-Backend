import { Router } from "express";
import { createPostControl, deletePostControl, editPostControl, getAllPostControl } from "../controllers/post.js";
import { isAdmin } from "../middlewares/adminAuth.js";
import { commentRoute } from "./comment.js";


const postRoutes = Router()

postRoutes.get('/', getAllPostControl)
postRoutes.get('/:postId',  (req, res) => {
    res.json({
        message: 'here ppl will see the individual post in details with comments'
    })
})

postRoutes.post('/', isAdmin, createPostControl)

postRoutes.patch('/:postId', isAdmin, editPostControl)
postRoutes.delete('/:postId', isAdmin, deletePostControl)
postRoutes.use('/:postId/', commentRoute);




export { postRoutes }