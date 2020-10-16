module.exports = {
    Query: {
        users: async (parent, args, { models }) => {
            return await models.User.find({});
        },
        user: async (parent, { id }, { models }) => {
            return await models.User.findById(id);
        },
        me: async (parent, args, { models, me }) => {
            if (!me) return null;
            return await models.User.findById(me.id);
        }
    },
    User: {
        company: async (user, args, { models }) => {
            return await models.Company.findById( user.company );
        },
        displays: async (user, args, { models }) => {
            return await models.Display.find({ author: user.id });
        }
    }
};