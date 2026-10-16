import { createNewPost, deletePost, editExistingPost, postExists } from "../db/query.js";

const createPost = async (req, res, next) => {
    const { title, content } = req.body;
    const authorId = req.user.id;


    if (!title || !content) {
        return res.status(400).json({
            message: 'Title and content are required!'
        });
    }

    try {
        const newPost = await createNewPost({ title, content, authorId });

        if (newPost) {

            return res.status(201).json({
                message: 'Post created successfully',
                post: newPost
            });
        }

        return res.status(400).json({
            message: 'Something went wrong creating the post!'
        });
    } catch (error) {

        next(error);
    }
}

const editPost = async (req, res, next) => {
    const data = req.body;
    const id = parseInt(req.params.postId);
    const exits = await postExists(id)
    if (!exits) {
        return res.status(404).json({
            message: `no post found with id ${id}`
        })
    }
    try {
        const updatedPost = await editExistingPost(id, data)
        return res.status(200).json({
            message: 'Post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        next(error)
    }
}


const deletePostControl = async (req, res, next) => {
    const postId = parseInt(req.params.postId)
    const exists = await postExists(postId)
    if (!exists) {
        return res.status(404).json({
            message: `no post found with id ${postId}`
        })
    }
    try {
        await deletePost(postId)
        res.json({
            message: `Delete post associated with id ${postId}`
        })
    } catch (error) {
        next(error)
    }
}

export { createPost, editPost, deletePostControl };