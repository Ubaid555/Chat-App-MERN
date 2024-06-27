import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js"

export const login = async(req , resp)=>{
    try {
        const {userName,password}=req.body;
        const user = await User.findOne({userName});
        const isPasswordCorrect=await bcrypt.compare(password, user?.password||"")

        if(!user || !isPasswordCorrect){
            return resp.status(400).json({error:"Invalid Username Or Password"});
        }

        generateTokenAndSetCookie(user._id,resp);

        resp.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            userName:user.userName,
            profilePic:user.profilePic
        })



    } catch (error) {
        console.log("Error's in Login Controller",error.message);
        resp.status(500).json({error:"Internal Server Error"})
    }
}

export const signup = async(req , resp)=>{
    try {
        const {fullName,userName,password,confirmPassword,gender}=req.body;
        if(password!== confirmPassword){
            return resp.status(400).json({error:"Password's Don't Match"})
        }

        const user = await User.findOne({userName});
        if(user){
            return resp.status(400).json({error:"User Already Exist's"})
        }

        //Hash Passwrod
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //Avatar Place Holder
        const boyProfilePic = `https://avatar-placeholder.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar-placeholder.iran.liara.run/public/girl?username=${userName}`


        const newUser = new User ({
            fullName,
            userName,
            password:hashedPassword,
            gender,
            profilePic:gender==="male"? boyProfilePic : girlProfilePic
        })

        if(newUser){
        //Generate GWT Token
        generateTokenAndSetCookie(newUser._id,resp);

        await newUser.save();

        resp.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            userName:newUser.userName,
            profilePic:newUser.profilePic
        })
    }else{
        resp.status(400).json({error: "Invalid User Data"})
    }

    } catch (error) {
        console.log(error.message);
        resp.status(500).json({error:"Internal Server Error"})
    }
}

export const logout = async(req , resp)=>{
    try {
        resp.cookie("jwt","",{maxAge:0})
        resp.status(200).json({message:"Logged Out successfully"});
    }  catch (error) {
        console.log("Error In Logout",error.message);
        resp.status(500).json({error:"Internal Server Error"})
    }
}