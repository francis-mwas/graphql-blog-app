import bcrypt from "bcryptjs";
import getuserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email taken");
    }

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };
  },

  async userLogin(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email,
      },
    });

    if (!user) {
      throw new Error("User with this email does not exist");
    }

    const password = args.data.password;
    const dbPassword = user.password;

    const isMatch = await bcrypt.compare(password, dbPassword);

    if (!isMatch) {
      throw new Error("Invalid user password");
    }

    return {
      user,
      token: generateToken(user.id),
    };
  },

  async deleteUser(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);
    const userExist = await prisma.exists.User({ id: args.id });

    if (!userExist) {
      throw new Error("User not found");
    }

    return await prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    );
  },

  async updateUser(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }

    const user = await prisma.exists.User({ id: args.id });

    if (!user) {
      throw new Error("User not found");
    }

    return await prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data: args.data,
      },
      info
    );
  },

  async createPost(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);

    return await prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
  },

  async deletePost(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);

    const postExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExist) {
      throw new Error("Unable to delete post");
    }

    return await prisma.mutation.deletePost(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async updatePost(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);
    const post = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true,
    });

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id,
          },
        },
      });
    }

    return await prisma.mutation.updatePost(
      {
        where: {
          id: args.id,
        },
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
        },
      },
      info
    );
  },

  async createComment(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true,
    });

    if (!postExists) {
      throw new Error("Unable to create comment");
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },

  async deleteComment(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });
    if (!commentExists) {
      throw new Error("Unable to delete comment");
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  async updateComment(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("Unable to update comment");
    }

    return await prisma.mutation.updateComment(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
};

export { Mutation as default };
