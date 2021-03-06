const { ForbiddenError } = require('apollo-server');
const { combineResolvers, skip } = require('graphql-resolvers');

const isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === 'ADMIN'
    ? skip
    : new ForbiddenError('Access Denied'), // or ('Not authorized as admin.'),
);

// const isMessageOwner = async ( parent, { id }, { models, me } ) => {
//     const myModel = await models.myModel.findById(id);

//     if (myModel.userId != me.id) {
//         throw new ForbiddenError('Not authenticated as owner.');
//     }
//     return skip;
// };
module.exports = {
    isAuthenticated,
    isAdmin
}