import getuserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    };

    if (args.query) {
      opArgs.where = {
        AND: [
          {
            name_contains: args.query,
          },
          {
            email_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(opArgs, info);
    // if (!args.query) {
    //   return db.users;
    // }

    // return db.users.filter((user) => {
    //   return user.name.toLowerCase().includes(args.query.toLowerCase());
    // });
  },

  async myPosts(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        author: {
          id: userId,
        },
      },
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return await prisma.query.posts(opArgs, info);
  },

  posts(parent, args, { prisma }, info) {
    const opArgs = {
      orderBy: args.orderBy,
      where: {
        published: true,
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { db, prisma }, info) {
    const opArgs = {
      orderBy: args.orderBy,
      first: args.first,
      skip: args.skip,
      after: args.after,
    };

    if (args.query) {
      opArgs.where = {
        text_contains: args.query,
      };
    }
    return prisma.query.comments(opArgs, info);
  },

  async me(parent, args, { prisma, req }, info) {
    const userId = getuserId(req);

    const user = await prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      info
    );
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
  async post(parent, args, { prisma, req }, info) {
    const userId = getuserId(req, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true,
            },
            {
              author: {
                id: userId,
              },
            },
          ],
        },
      },
      info
    );

    if (posts.length === 0) {
      throw new Error("Post not found");
    }
    return posts[0];
  },
};

export { Query as default };
