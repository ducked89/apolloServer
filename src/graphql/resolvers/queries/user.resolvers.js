const { User } = require("../../../models");
// const { getUserID } = require("../../../utils/");

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
        // messages: async (user, args, { models }) => {
        //     return await models.Message.find({
        //         userId: user.id,
        //     });
        // },
    }
};