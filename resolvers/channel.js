import formatErrors from '../shared/formatErrors';
import requiresAuth from '../shared/permissions';

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const member = await models.Member.findOne({ where: { teamId: args.teamId, userId: user.id } }, { raw: true });
        if (!member.admin) {
          return {
            ok: false,
            errors: [
              {
                path: 'name',
                message: 'Only the team owner can create channels',
              },
            ],
          };
        }
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
  },
};
