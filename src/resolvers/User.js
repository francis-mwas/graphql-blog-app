import getuserId from "../utils/getUserId";

const User = {
  email: {
    fragment: "fragment userId on User{ id }",
    resolve(parent, args, { req }, info) {
      const userId = getuserId(req, false);

      if (userId && userId === parent.id) {
        return parent.email;
      } else {
        return null;
      }
    },
  },
  posts: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          author: {
            id: parent.id,
          },
          published: true,
        },
      });
    },
  },
};

export { User as default };
