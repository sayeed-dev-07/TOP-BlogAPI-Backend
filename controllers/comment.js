import { commentExists, deleteComment, editComment, getCommentsByPost, postComment, postExists } from "../db/query.js";

const postCommentControl = async (req, res, next) => {
    const { content } = req.body
    const postId = parseInt(req.params.postId);
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
    const { content } = req.body;
    const commentId = parseInt(req.params.commentId);
    const exist = await commentExists(commentId)

    if (!exist) {
        return res.status(404).json({
            message: `no comment found with id ${commentId}`
        })
    }
    if (typeof content === 'undefined') {
        return res.status(403).json({
            message: "you must provide 'content' field",
        });
    }
    if (exist.authorId !== req.user.id) {
        return res.status(403).json({
            message: "You cannot modify another user's comment",
        });
    }
    try {
        await editComment(content, commentId)
        return res.status(200).json({
            message: 'successfully edited the comment'
        })

    } catch (error) {
        next(error)
    }
}
const deleteCommentControl = async (req, res, next) => {
    const commentId = parseInt(req.params.commentId);
    const exist = await commentExists(commentId)
    if (!exist) {
        return res.status(404).json({
            message: `no comment found with id ${commentId}`
        })
    }
    if (exist.authorId !== req.user.id) {
        return res.status(403).json({
            message: "You cannot delete another user's comment",
        });
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

const getAllCommentControl = async (req, res, next) => {
    const postId = parseInt(req.params.postId);
    const exists = await postExists(postId)
    if (!exists) {
        return res.status(404).json({
            message: `no post found with id ${postId}`
        })
    }
    try {
        const comments = await getCommentsByPost(postId)
        return res.status(200).json({
            data: comments
        })
    } catch (error) {
        next(error)
    }
}

export { postCommentControl, editCommentControl, deleteCommentControl, getAllCommentControl }