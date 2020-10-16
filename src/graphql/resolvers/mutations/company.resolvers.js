const { combineResolvers } = require('graphql-resolvers');

const { isAdmin } = require('../../../utils/authorization');

const saveOwner = async (company, owner, models) => {
    if (company) {
        const oneUser = await models.User.findOne({ company: company._id });
        if (oneUser && oneUser.username === owner.username) {
            throw new Error("username existed already!");
        }
        const user = await models.User.create({ ...owner, role: "OWNER", company: company._id });
        if (user) {
            return user;
        }
        await models.Company.deleteOne({ id: company._id });
        throw new Error("User won't be saved!");
    }
};

module.exports = {
    Mutation: {
        createCompany: combineResolvers(
            isAdmin,
            async (parent, { data }, { models, me }) => {
                const { company, owner } = data;

                const newCompany = new models.Company({
                    ...company,
                    author: me.id,
                });
                const comp = await newCompany.save();
                const user = await saveOwner(comp, owner, models);
        
                if (!comp || !user) {
                    throw new Error("Company or Owner won't be created!");
                }
                return { company: comp, owner: user };
            },
        ),
    }
};
