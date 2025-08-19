import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}