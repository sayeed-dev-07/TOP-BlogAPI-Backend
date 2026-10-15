import { isUniqueUser, createNewUser, getUser } from "../db/query.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

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
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const exist = await isUniqueUser(username);
        if (exist) {
            return res.status(401).json({ message: 'username or password incorrect!' });
        }

        // Fetch user and compare password
        const user = await getUser(username);
        const compare = await bcrypt.compare(password, user.password);

        if (!compare) {
            return res.status(401).json({ message: 'username or password incorrect!' });
        }

        // 1. Create the JWT payload using the database user details
        const payload = {
            id: user.id,
            username: user.username,
            admin: user.admin
        };

        const jwtSecret = process.env.JWT_SECRET;

        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: '2d'
        });

        return res.status(200).json({
            message: 'successfully logged in',
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export { registerUser, login };