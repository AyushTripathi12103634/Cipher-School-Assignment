import usermodel from "../models/usermodel.js";
import { hashPassword, comparePassword } from "../helpers/authhelper.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is required",
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "email is required",
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: "Password is required",
            });
        }

        const hashed_password = await hashPassword(password);

        const exist_email = await usermodel.findOne({ email: email });
        if (exist_email) {
            return res.status(409).send({
                success: false,
                message: "User already exists",
            });
        }

        try {
            const user = await new usermodel({
                name: name,
                email: email,
                password: hashed_password,
            }).save();
            return res.status(201).send({
                success: true,
                message: "user registered successfully",
                user,
            });
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed to create user",
                error: error,
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in register API",
            error: error,
        });
    }
};

export const loginController = async (req, res) => {
    // try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required",
            });
        }
        if (!password) {
            return res.status(400).send({
                success: false,
                message: "Password is required",
            });
        }
        const user = await usermodel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "No User found",
            });
        }
        const result = await comparePassword(password, user.password);
        if (result) {
            const token = await JWT.sign(
                {
                    _id: user._id,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            return res.status(200).send({
                success: true,
                message: "Logged in successfully",
                user: {
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified,
                },
                token,
            });
        } else {
            return res.status(401).send({
                success: false,
                message: "Invalid Password",
            });
        }
    // } catch (error) {
    //     return res.status(500).send({
    //         success: false,
    //         message: "Failed to login",
    //         error: error
    //     });
    // }
};

export const islogincontroller = async(req,res) => {
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).send({
                success:false,
                message:"No JWT Token Provided"
            })
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        return res.status(200).send({
            success: true,
            message: decoded?"":"Login Expired.",
            status: decoded
        })
    } catch (error) {
        console.error(error); // Log the error
        return res.status(500).send({
            success:false,
            message:"An error occurred"
        })
    }
};
