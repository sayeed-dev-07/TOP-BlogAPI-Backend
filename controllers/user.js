import { isUniqueUser, createNewUser } from "../db/query"


const registerUser = async (req, res) => {
    const isUnique = await isUniqueUser(data.username)
    if (isUnique) {
        await createNewUser(data)
    } else {
        return res.status(401).json({
            message: 'user already exists'
        })
    }
}

export { registerUser }