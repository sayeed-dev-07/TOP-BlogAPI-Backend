import { createNewPost, deletePost, editExistingPost, getAllPost, getPostViaId, postExists } from "../db/query.js";


const getAPostControl = async (req, res, next) => {
    const id = parseInt(req.params.postId)
    const exists = await postExists(id)
    if (!exists) {
        return res.status(404).json({
            message: `no post found with id ${id}`
        })
    }
    try {
        const data = await getPostViaId(id)
        return res.status(200).json({
            data
        })
    } catch (error) {
        next(error)
    }

}

const createPostControl = async (req, res, next) => {
    const { title, content, imgLink } = req.body;
    const authorId = req.user.id;
    if (!title || !content || !imgLink) {
        return res.status(400).json({
            message: 'Title and content and img are required!'
        });
    }
    try {
        const newPost = await createNewPost({ title, content, authorId , imgLink});

        if (newPost) {
            return res.status(201).json({
                message: 'Post created successfully',
                post: newPost
            });
        }

        return res.status(400).json({
            message: 'some fields are missing or invalid'
        });
    } catch (error) {

        next(error);
    }
}

const editPostControl = async (req, res, next) => {
    const data = req.body;
    const id = parseInt(req.params.postId);
    const exits = await postExists(id)
    if (!exits) {
        return res.status(404).json({
            message: `no post found with id ${id}`
        })
    }
    const { title, content, imgLink } = data;

    if (title === undefined && content === undefined && imgLink === undefined) {
        return res.status(400).json({
            message: 'At least one field (title or content or imglink) is required',
        });
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
        return res.json({
            message: `Deleted post associated with id ${postId}`
        })
    } catch (error) {
        next(error)
    }
}

const getAllPostControl = async (req, res) => {
    const posts = await getAllPost();
    res.status(200).json({
        posts
    })

}

export { createPostControl, editPostControl, deletePostControl, getAllPostControl, getAPostControl };
