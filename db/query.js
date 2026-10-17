import { prisma } from "../lib/prisma.js";


// user related quries
const isUniqueUser = async (username) => {
    const exits = await prisma.user.findFirst({
        where: {
            username
        }
    })
    if (exits) {
        return false;
    }
    return true;
}

const createNewUser = async (data) => {
    await prisma.user.create({
        data: {
            username: data.username,
            password: data.password,
        }
    })
}
const getUser = async (username) => {
    return await prisma.user.findFirst({
        where: {
            username
        }
    })
}


// post related quries
const getPostViaId = async (id) => {
    return await prisma.post.findFirst({
        where: {
            id
        }
    })
}

const createNewPost = async (data) => {
    return await prisma.post.create({
        data: {
            title: data.title,
            content: data.content,
            authorId: data.authorId
        }
    })
}
const postExists = async (id) => {
    return await prisma.post.findFirst({
        where: {
            id
        }
    })
}


const editExistingPost = async (id, data) => {
    const { title, content } = data;
    return await prisma.post.update({
        where: {
            id
        },
        data: {
            ...(title && { title }),
            ...(content && { content }),
        }
    })
}
const deletePost = async (id) => {
    await prisma.post.delete({
        where: {
            id
        }
    })
}

const publishPost = async (id) => {
    await prisma.post.update({
        where: {
            id
        },
        data: {
            published: true
        }
    })
}

const getAllPost = async () => {
    return await prisma.post.findMany()
}

// comment related quries

const getCommentsByPost = async (postId) => {
    return await prisma.comment.findMany({
        where: {
            postId
        }
    })
}

const postComment = async (data) => {
    return await prisma.comment.create({
        data: {
            content: data.content,
            authorId: data.authorId,
            postId: data.postId
        }
    })
}
const editComment = async (content) => {
    await prisma.comment.update({
        data: {
            content
        }
    })
}

const commentExists = async (id) => {
    return await prisma.comment.findFirst({
        where: {
            id
        }
    })
}

const deleteComment = async (id) => {
    await prisma.comment.delete({
        where: {
            id
        }
    })
}

export { createNewUser, isUniqueUser, createNewPost, editExistingPost, deletePost, publishPost, postComment, deleteComment, getUser, postExists, editComment, commentExists, getCommentsByPost, getAllPost, getPostViaId }