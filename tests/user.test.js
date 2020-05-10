import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import { createTestClient } from "apollo-server-testing";
import prisma from "../src/prisma";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { createUser, getUsers, login, getProfile } from "./utils/operations";
import server from "../src/server";

const prismaToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNlcnZpY2UiOiJkZWZhdWx0QHRlc3QiLCJyb2xlcyI6WyJhZG1pbiJdfSwiaWF0IjoxNTg5MTA1MzM4LCJleHAiOjE1ODk3MTAxMzh9.pnLBumddp5TxopozYoQy4F6uGYWufatI2C4VlfQxwcE";

// const client = getClient(prismaToken);
const client = createTestClient(server);
const { mutate, query } = client;

beforeEach(seedDatabase);

test("Should create a new user", async () => {
  const variables = {
    data: {
      name: "mwas",
      email: "mwas@gmail.com",
      password: "mwas12345",
    },
  };

  const response = await mutate({
    mutation: createUser,
    variables,
  });

  const exists = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });
  expect(exists).toBe(true);
});

// test("Should expose public user profile", async () => {
//   const response = await client.query({ query: getUsers });

//   expect(response.data.users.length).toBe(1);
//   expect(response.data.users[0].email).toBe(null);
//   expect(response.data.users[0].name).toBe("fram");
// });

// test("should not login with bad credentials", async () => {
//   const variables = {
//     data: {
//       email: "framd@gmail.com",
//       password: "wertyui",
//     },
//   };

//   await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
// });

// test("Should not create user with short password, less than six characters", async () => {
//   const variables = {
//     data: {
//       name: "mwas1",
//       email: "mwas1@gmail.com",
//       password: "123",
//     },
//   };

//   await expect(
//     client.mutate({ mutation: createUser, variables })
//   ).rejects.toThrow();
// });

// test("Should fetch user profile", async () => {
//   const client = getClient(userOne.jwt);

//   const { data } = await client.query({ query: getProfile });

//   expect(data.me.id).toBe(userOne.user.id);
//   expect(data.me.name).toBe(userOne.user.name);
//   expect(data.me.email).toBe(userOne.user.email);
// });
