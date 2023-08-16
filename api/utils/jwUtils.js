import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const options = { expiresIn: "1h" };

  return jwt.sign(payload, secretKey, options);
};

const verifyToken = (token) => {
  const secretKey = process.env.JWT_SECRET_KEY;

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };
