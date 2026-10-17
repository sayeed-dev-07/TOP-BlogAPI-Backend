import { Router } from "express";
import { deleteCommentControl, postCommentControl, editCommentControl } from "../controllers/comment.js";

const commentRoute = Router({ mergeParams: true });

commentRoute.get('/', postCommentControl)
commentRoute.post('/', postCommentControl)
commentRoute.patch('/:commentId', editCommentControl)
commentRoute.delete('/:commentId', deleteCommentControl)

export { commentRoute }