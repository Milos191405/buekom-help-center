import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSendCookie } from '../utils/generateToken.js';

// signup function
export async function signup(req, res) { 
    try {
        const { username, password } = req.body;
        
        if(!username || !password) {
            return res.status(400).json({message: "Please fill in all fields"});
        }

           if (password.length < 6) {
             return res.status(400).json({
               success: false,
               message: "Password must be at least 6 characters",
             });
           }

        const existingUser = await User.findOne({ username })
        if(existingUser) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, password: hashedPassword });

        // save new user to the data base
        await newUser.save();
        generateTokenAndSendCookie(res, newUser._id);

        //remove password from the response
        const { password: _, ...userWithoutPassword } = newUser._doc;
        
        //send success response with user data 
        res.status(201).json({success: true, user: userWithoutPassword});


    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

// login function

export async function login(req, res) {
    try {
        const { username, password } = req.body;

        //validate input 
        if (!username || !password) { 
            return res.status(400).json({success: false, message: "Please fill in all fields"});
        }

        //find the user by username
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        // check if provided password matches hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        //generate token and send cookie
        generateTokenAndSendCookie(res, user._id);

        //send success response with user data(without password)
        const { password: _, ...userWithoutPassword } = user._doc;
        res.status(200).json({success: true, user: userWithoutPassword});

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

// logout function
export async function logout(_, res) {
    try {
        res.clearCookie("jwt-buekom");
        return res.status(200).json({success: true, message: "Logged out"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}