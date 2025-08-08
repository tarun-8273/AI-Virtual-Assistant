import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "Token not found" });
        }
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken) {
            return res.status(400).json({ message: "Invalid token" });
        }
        req.userId = verifyToken.userId;
        next();

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default isAuth;