import { validateRegister, validateLogin } from "../schemas/user.schema.js";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { createAccessToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export class UserController {
    
    static async register (req, res) {
        try{
            const result = validateRegister(req.body);
            if (!result.success) {
            return res.status(400).json({ error: result.error.message });
        }

        const { name, email, password } = result.data;

        const userExists = await UserModel.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create(name, email, passwordHash);

        const token = await createAccessToken({ id: newUser.id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict",
        })

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        })
    } catch ( error ) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
    }

    static async login (req, res) {
      try{
        const result = validateLogin(req.body);
        if(!result.success){
            return res.status(400).json({ error: result.error.message });
        }

        const { email, password } = result.data;

        const userFound = await UserModel.findByEmail(email);
        if (!userFound) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, userFound.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = await createAccessToken({ 
          id: userFound.id,
          name: userFound.name,
         });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict",
        })

        res.status(200).json({
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
        })

      }catch( error ){
        console.log(error);
        return res.status(500).json({ error: error.message });
      }
    }

    static async verifyToken(req, res) {
        try {
          const { token } = req.cookies;
          if (!token) return res.sendStatus(401);
      
          // verificamos el token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
          // buscamos al usuario
          const userFound = await UserModel.getById(decoded.id);
          if (!userFound) return res.sendStatus(401);
      
          return res.json({
            id: userFound.id,
            name: userFound.name,
            email: userFound.email,
          });
      
        } catch (error) {
          return res.sendStatus(401);
        }
    }

    static async logout(req, res) {
        res.cookie("token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: new Date(0),
          sameSite: "strict",
        });
        return res.status(200).json({ message: "Logout successful" });
      }
      
}
