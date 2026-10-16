import { createNewPost } from "../db/query.js";

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

export { createPost };