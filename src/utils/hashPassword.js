import bcrypt from "bcryptjs";

const hashPassword = (password) => {
  // validate password
  if (password.length < 6) {
    throw new Error("Password must be 6 characters or longer.");
  }
  // hash the password using bcrypt
  return bcrypt.hash(password, 10);
};

export default hashPassword;
