const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { AuthenticationError, UserInputError } = require('apollo-server');
const { combineResolvers } = require('graphql-resolvers');

const { isAdmin, isAuthenticated } = require('../../../utils/authorization');

const createToken = async (user, secret, expiresIn) => {
    const { id, username, role } = user;
    return await jwt.sign({ id, username, role }, secret, {
      expiresIn,
    });
};

module.exports = {
    Mutation: {
        signUp: async (parent, { data }, { models, secret, exp_secret }) => {
            const { name, username, password, role, status } = data;
            const user = await models.User.create({ name, username, password, role, status });
            return { token: createToken( user, secret, exp_secret ) };
        },
        signIn: async (parent, { credentials }, { models, secret, exp_secret }, info) => {
            const { username, password } = credentials;
            // Verify username
            const user = await models.User.findByLogin(username);
            if (!user) {
                throw new UserInputError('No user found with this credentials.');
            }

            // Verify password
            const isValid = await user.validatePassword(password);
            if (!isValid) {
                throw new AuthenticationError('No user found with this credentials.');
            }
            return { token: createToken(user, secret, exp_secret) };
        },
        editUser: combineResolvers(
            isAuthenticated,
            async (parent, { data }, { models, me }) => {
                return await models.User.findByIdAndUpdate(
                    me.id, // or { _id: "5f8898df0cc11a4e9e9101bb" },
                    { ...data },
                    { new: true },
                );
            },
        ),
        deleteUser: combineResolvers(
            isAdmin,
            async (parent, { id }, { models }) => {
                const user = await models.User.findById(id);
                if (user) {
                    console.log(user);
                    return user.remove({id});
                } else {
                    return false;
                }
            },
        ),
    }
}