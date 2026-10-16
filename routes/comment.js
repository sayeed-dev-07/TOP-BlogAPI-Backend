import { Router } from "express";
import { deleteCommentControl, postCommentControl, editCommentControl } from "../controllers/comment.js";

const commentRoute = Router({ mergeParams: true });

commentRoute.post('/', postCommentControl)
commentRoute.patch('/', editCommentControl)
commentRoute.delete('/:commentId', deleteCommentControl)

export { commentRoute }