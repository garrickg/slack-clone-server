import formatErrors from '../shared/formatErrors';
import requiresAuth from '../shared/permissions';

export default {
  Query: {
    getTeamMembers: requiresAuth.createResolver(async (parents, { teamId }, { models }) => models.sequelize.query(
      'select * from users as u join members as m on m.user_id = u.id where m.team_id = ?',
      {
        replacements: [teamId],
        model: models.User,
        raw: true,
      },
    )),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const response = await models.sequelize.transaction(async () => {
          const team = await models.Team.create({ ...args });
          await models.Channel.bulkCreate([
            { name: 'general', public: true, teamId: team.id },
            { name: 'random', public: true, teamId: team.id },
          ]);
          await models.Member.create({ teamId: team.id, userId: user.id, admin: true });
          return team;
        });
        return {
          ok: true,
          team: response,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
    addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
      try {
        const memberPromise = models.Member.findOne({ where: { teamId, userId: user.id } }, { raw: true });
        const userToAddPromise = models.User.findOne({ where: { email } }, { raw: true });
        const [member, userToAdd] = await Promise.all([memberPromise, userToAddPromise]);
        if (!member.admin) {
          return {
            ok: false,
            errors: [{ path: 'email', message: 'You cannot add members to this team' }],
          };
        }
        if (!userToAdd) {
          return {
            ok: false,
            errors: [{ path: 'email', message: 'Could not find user with this email' }],
          };
        }
        await models.Member.create({ userId: userToAdd.id, teamId });
        return {
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    }),
  },
  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
    directMessageMembers: ({ id }, args, { models, user }) =>
      models.sequelize.query(
        'select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId and u.id != :currentUserId',
        {
          replacements: { currentUserId: user.id, teamId: id },
          model: models.User,
          raw: true,
        },
      ),
  },
};
