import { Router } from "express";
import { createPostControl, deletePostControl, editPostControl, getAllPostControl, getAPostControl } from "../controllers/post.js";
import { isAdmin } from "../middlewares/adminAuth.js";
import { commentRoute } from "./comment.js";
import { verifyAuth } from "../middlewares/jwtAuth.js";


const postRoutes = Router()

postRoutes.get('/', getAllPostControl)
postRoutes.get('/:postId', getAPostControl)

postRoutes.post('/', verifyAuth, isAdmin, createPostControl)

postRoutes.patch('/:postId', verifyAuth, isAdmin, editPostControl)
postRoutes.delete('/:postId', verifyAuth, isAdmin, deletePostControl)
postRoutes.use('/:postId/comments', commentRoute);


export { postRoutes }