const { User, Book } = require(`../models`);
const { signToken } = require(`../utils/auth`);
const { AuthenticationError } = require(`apollo-server-express`); 

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select(`-_v -password`)
                return userData;
            }
            throw new AuthenticationError(`The user is not logged in`);
        }
    }
    
}

module.exports = resolvers;