import { isUniqueUser, createNewUser, getUser } from "../db/query.js";
import bcrypt from "bcryptjs";




const registerUser = async (req, res) => {
    try {
        let { username, password } = req.body;
        password = await bcrypt.hash(password, 12)
        const data = { username, password }
        const isUnique = await isUniqueUser(data.username);

        if (isUnique) {
            await createNewUser(data);
            return res.status(201).json({
                message: 'User registered successfully'
            });
        } else {
            return res.status(409).json({
                message: 'User already exists'
            });
        }
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const exist = await isUniqueUser(username)
    if (exist) {
        return res.json('username or password incorrect!')
    }
    const user = await getUser(username)
    const compare = await bcrypt.compare(password, user.password)
    if (!compare) {
        return res.json('username or password incorrect!')
    }
    return res.json({
        message: 'successfully logged in'
    })
}


export { registerUser, login };