import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Define the payload interface
export interface JwtPayload {
  email: string;
  exp?: number;
}

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET || "";
if (!secretKey) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Create a token with a 3-hour expiration
export const createToken = (payload: JwtPayload): string => {
  try {
    return jwt.sign(payload, secretKey, { expiresIn: "3h" }); // Corrected "expiresIn" format
  } catch (err) {
    throw new Error("Failed to create token: " + err);
  }
};

// Validate token and check if it's expired
export const validateToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    if (isTokenExpired(decoded)) {
      throw new Error("Token has expired");
    }

    return decoded;
  } catch (err) {
    console.error("Token validation error:", err);
    throw new Error("Invalid or expired token");
  }
};

// Decode token without verification
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (decoded && isTokenExpired(decoded)) {
      console.log("Token has expired.");
      return null;
    }
    return decoded;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};

// Check if the token is expired based on the 'exp' claim
export const isTokenExpired = (decoded: JwtPayload): boolean => {
  if (!decoded.exp) {
    return false;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTimestamp;
};
