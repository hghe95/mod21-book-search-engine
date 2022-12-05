const { User } = require(`../models`);
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
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { user, token };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne( { email });
            if (!user) {
                throw new AuthenticationError(`Email or password was incorrect, please try again`)
            }
            const correctPass = await user.isCorrectPassword(password);
            if(!correctPass) {
                throw new AuthenticationError(`Email or password was incorrect, please try again`)
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args , context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user_id },
                    { $addToSet: { savedBooks: args.input }},
                    { new: true }
                )
                return updatedUser;
            }
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user_id },
                    { $addToSet: { savedBooks: args.bookId }},
                    { new: true }                    
                );
                return updatedUser;
            }
            throw new AuthenticationError(`The user must log in`)
        }
        
    }
}

module.exports = resolvers;