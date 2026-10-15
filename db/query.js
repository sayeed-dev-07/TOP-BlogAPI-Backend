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
const createNewPost = async (data) => {
    await prisma.post.create({
        data: {
            title: data.title,
            content: data.content,
            authorId: data.authorId
        }
    })
}

const editExistingPost = async (id, data) => {
    await prisma.post.update({
        where: {
            id
        },
        data: {
            content: data.content,
            title: data.title,
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


// comment related quries

const postComment = async (data) => {
    await prisma.comment.create({
        data: {
            content: data.content,
            authorId: data.authorId,
            postId: data.postId
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

export { createNewUser, isUniqueUser, createNewPost, editExistingPost, deletePost, publishPost, postComment, deleteComment, getUser }