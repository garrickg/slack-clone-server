export default `
    type Team {
        id: Int!
        directMessageMembers: [User!]!
        channels: [Channel!]!
        name: String!
        admin: Boolean!
    }

    type CreateTeamResponse {
        ok: Boolean!
        team: Team
        errors: [Error!]
    }

    type Query {
        allTeams: [Team!]!
        inviteTeams: [Team!]!
        getTeamMembers(teamId: Int!): [User]!
    }

    type VoidResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
        addTeamMember(email: String!, teamId: Int!): VoidResponse!
    }
`;
