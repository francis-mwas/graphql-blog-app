// import "cross-fetch/polyfill";
// import { gql } from "apollo-boost";
// import prisma from "../src/prisma";
// import seedDatabase, { userOne, postOne, postTwo } from "./utils/seedDatabase";
// import getClient from "./utils/getClient";
// import {
//   getPosts,
//   myPosts,
//   updatePost,
//   createPost,
//   deletePost,
// } from "./utils/operations";

// const client = getClient();

// beforeEach(seedDatabase);

// test("Should return all published posts", async () => {
//   const response = await client.query({ query: getPosts });

//   expect(response.data.posts.length).toBe(2),
//     expect(response.data.posts[0].published).toBe(true);
// });

// test("should fetch user's posts", async () => {
//   const client = getClient(userOne.jwt);

//   const { data } = await client.query({ query: myPosts });
//   expect(data.myPosts.length).toBe(2);
//   //   expect(data.myPosts.)
// });

// test("Should update own post", async () => {
//   const client = getClient(userOne.jwt);

//   const variables = {
//     id: postOne.post.id,
//     data: {
//       published: true,
//     },
//   };
//   const { data } = await client.mutate({ mutation: updatePost, variables });
//   const exists = await prisma.exists.Post({
//     id: postOne.post.id,
//     published: true,
//   });
//   expect(exists).toBe(true);
//   expect(data.updatePost.published).toBe(true);
// });

// test("It should create user post", async () => {
//   const client = getClient(userOne.jwt);

//   const variables = {
//     data: {
//       title: "Another from me",
//       body: "",
//       published: true,
//     },
//   };

//   const { data } = await client.mutate({ mutation: createPost, variables });
//   expect(data.createPost.title).toBe("Another from me");
//   expect(data.createPost.body).toBe("");
//   expect(data.createPost.published).toBe(true);
// });

// test("Should delete post", async () => {
//   const client = getClient(userOne.jwt);

//   const variables = {
//     id: postTwo.post.id,
//   };

//   await client.mutate({ mutation: deletePost, variables });
//   const exists = await prisma.exists.Post({ id: postTwo.post.id });

//   expect(exists).toBe(false);
// });
