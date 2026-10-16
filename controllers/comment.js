import { commentExists, deleteComment, editComment, postComment, postExists } from "../db/query.js";

const postCommentControl = async (req, res, next) => {
    const { content } = req.body
    const postId = req.params.postId;
    const exist = await postExists(postId)
    const authorId = req.user.id;
    if (!exist) {
        return res.status(404).json({
            message: `no post found with id ${postId}`
        })
    }
    try {
        const comment = await postComment({ content, authorId, postId })
        if (comment) {
            return res.status(201).json({
                message: 'successfully added the comment'
            })
        }
        return res.status(400).json({
            message: 'some fields are missing or invalid'
        });
    } catch (error) {
        next(error)
    }
}
const editCommentControl = async (req, res, next) => {
    const { content, commentId } = req.body;
    const exist = await commentExists(commentId)
    if (!exist) {
        return res.status(404).json({
            message: `no comment found with id ${commentId}`
        })
    }
    try {
        await editComment(content)
        return res.status(200).json({
            message: 'successfully edited the comment'
        })

    } catch (error) {
        next(error)
    }
}
const deleteCommentControl = async (req, res, next) => {
    const commentId = req.params.commentId;
    const exist = await commentExists(commentId)
    if (!exist) {
        return res.status(404).json({
            message: `no comment found with id ${commentId}`
        })
    }
    try {
        await deleteComment(commentId)
        return res.json({
            message: `comment with id = ${commentId} is deleted`
        })
    } catch (error) {
        next(error)
    }
}

export { postCommentControl, editCommentControl, deleteCommentControl }