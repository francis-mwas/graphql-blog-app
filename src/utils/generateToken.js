import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, "mysecrethere", {
    expiresIn: "7 days",
  });
  return token;
};

export default generateToken;
