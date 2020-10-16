const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('../../../utils/authorization');

module.exports = {
    Query: {
        displays: combineResolvers(
            isAuthenticated,
            async (parent, args, { models, me }, info) => {
                const displays = await models.Display.find({ author: me.id });
                return displays;
            }
        ),
        display: combineResolvers(
            isAuthenticated,
            async (parent, { id }, { models }) => {
                return await models.Display.findOne({ _id: id });
            }
        )
    },
    Display: {
        // playlists: async (parent, args, { req }, info) => {
        //     return Playlist.find({ _id: { $in: parent.playlists } });
        // },
        author: async ({ author }, args, { models }, info) => {
            return await models.User.findOne({ _id: author });
        },
    }
};