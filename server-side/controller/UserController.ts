import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey = process.env.JWT_SECRET || "defaultSecret";
const generateToken = (user: any) => {
    return jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "30 days"
    })
};

export const registerController = async (req: any, res: any) => {
    try {
        const { username, house, password, confirmPassword } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: "User already registered" });
        }

        if (password === confirmPassword) {

            const hashedPass = await bcrypt.hash(password, 10);

            const newUser = new User({
                username, house, password: hashedPass
            });

            await newUser.save();

            const token = generateToken(newUser);

            res.status(201).json({ user: newUser, token });
        }
        else {
            res.status(400).json({ error: "password does not match" });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const loginController = async (req: any, res: any) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (user.password) {
            const passMatch = await bcrypt.compare(password, user.password);

            if (!passMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = generateToken(user);
            console.log({ user, token })
            res.json({ user, token });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
};

export const userDataController = async (req: any, res: any) => {
    try {
        const { username } = req.body;
        let user = await User.findOne({ username: username });
        return res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error"});
    }
};

export const updateUsername = async (req: any, res: any) => {};

export const updatePassword = async (req: any, res: any) => {};