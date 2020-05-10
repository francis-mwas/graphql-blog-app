import bcrypt from "bcryptjs";
import prisma from "../../src/prisma";
import jwt from "jsonwebtoken";

const userOne = {
  input: {
    name: "fram",
    email: "fram@gmail.com",
    password: bcrypt.hashSync("mw@s!2345"),
  },
  user: undefined,
  jwt: undefined,
};

const postOne = {
  input: {
    title: "The sea adventure",
    body: "Do you want to experience a great exploration",
    published: false,
  },
  post: undefined,
};

const postTwo = {
  input: {
    title: "Java data structure",
    body: "Javascript is awesome",
    published: true,
  },
  post: undefined,
};

const seedDatabase = async () => {
  // clear the db before each test runs
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  // create user before each test
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input,
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);
  // create a post one before running a test
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...userOne.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  });

  // create post two

  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id,
        },
      },
    },
  });
};

export { seedDatabase as default, userOne, postOne, postTwo };
