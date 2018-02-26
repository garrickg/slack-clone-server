export default `
    type Team {
        id: Int!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
        teams: [Team!]!
    }

    type Mutation {
        createTeam(name: String!): Boolean!
    }
`;
