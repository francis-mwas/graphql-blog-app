import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, "mysecret", {
    expiresIn: "7 days",
  });
  return token;
};

export default generateToken;
