export default `
    type Team {
        id: Int!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
        name: String!
    }

    type CreateTeamResponse {
        ok: Boolean!
        team: Team!
        errors: [Error!]
    }

    type Query {
        allTeams: [Team!]!
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
    }
`;
