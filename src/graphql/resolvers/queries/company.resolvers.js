const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('../../../utils/authorization');

module.exports = {
    Query: {
        companies: combineResolvers(
            isAuthenticated,
            async (parent, args, { models }, info) => {
                return await models.Company.find({});
            },
        ),
        company: combineResolvers(
            isAuthenticated,
            async (parent, { id }, { models }) => {
                return await models.Company.findById(id);
            }
        )
    },
    Company: {
        author: async (company, args, { models }) => {
            // return await loaders.user.load(company.author);
            return await models.User.findOne({ _id: company.author});
        },
        users: async (company, args, { models }) => {
            return await models.User.find({ company: company.id});
        }
    },
};