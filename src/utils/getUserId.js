import jwt from "jsonwebtoken";

const getuserId = (req, requireAuth = true) => {
  const header = req.request
    ? req.request.headers.authorization
    : req.connection.context.Authorization;

  if (header) {
    const token = header.replace("Bearer ", "");

    const decoded = jwt.verify(token, "mysecrethere");

    return decoded.id;
  }

  if (requireAuth) {
    throw new Error("Authentication required");
  }

  return null;
};

export default getuserId;
