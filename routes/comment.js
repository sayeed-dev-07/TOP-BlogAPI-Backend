import { Router } from "express";
import { deleteCommentControl, postCommentControl, editCommentControl, getAllCommentControl } from "../controllers/comment.js";
import { verifyAuth } from "../middlewares/jwtAuth.js";

const commentRoute = Router({ mergeParams: true });

commentRoute.get('/', getAllCommentControl)
commentRoute.post('/', verifyAuth, postCommentControl)
commentRoute.patch('/:commentId', verifyAuth, editCommentControl)
commentRoute.delete('/:commentId', verifyAuth, deleteCommentControl)

export { commentRoute }