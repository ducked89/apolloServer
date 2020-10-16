const { combineResolvers } = require('graphql-resolvers');

const { isAuthenticated } = require('../../../utils/authorization');

module.exports = {
    Mutation: {
        createDisplay: combineResolvers(
            isAuthenticated,
            async (parent, { data }, { models, me }, info) => {
                const newDisplay = new models.Display({
                    ...data,
                    author: me.id,
                });

                const savedDisplay = await newDisplay.save().then(async (display) => {
                    const updatedUser = await models.User.findByIdAndUpdate(
                        me.id,
                        { $addToSet: { displays: display.id } },
                        { new: true, useFindAndModify: false }
                    );
                    return updatedUser && display;
                });
                return savedDisplay;
            }
        ),
        // addPlaylistToDisplay: async (parent, { data }, { req }, info) => {
        //     getUserID(req).user;
        //     const { playlist, display } = data;
        //     return Display.findByIdAndUpdate(
        //         display,
        //         { $addToSet: { playlists: playlist } },
        //         { new: true, useFindAndModify: false }
        //     );
        // },
        // removePlaylistToDisplay: async (parent, { data }, { req }, info) => {
        //     getUserID(req).user;
        //     const { playlist, display } = data;
        //     return Display.findByIdAndUpdate(
        //         display,
        //         { $pull: { playlists: playlist } },
        //         { new: true, useFindAndModify: false }
        //     );
        // }
    }
};