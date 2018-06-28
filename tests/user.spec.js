import axios from 'axios';

describe('user resolvers', () => {
  test('allUsers', async () => {
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `
            query {
                allUsers {
                    id
                    username
                    email
                }
            }
            `,
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        allUsers: [],
      },
    });
  });

  test('create team', async () => {
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `
            mutation {
                register(username: "testuser", email: "test@test.com", password: "password") {
                    ok
                    errors {
                        path
                        message
                    }
                    user {
                        username
                        email
                    }
                }
            }
        `,
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          errors: null,
          user: {
            username: 'testuser',
            email: 'test@test.com',
          },
        },
      },
    });

    const response2 = await axios.post('http://localhost:8080/graphql', {
      query: `
            mutation {
                login(email: "test@test.com", password: "password") {
                    token
                    refreshToken
                }
            }
        `,
    });

    const { data: { login: { token, refreshToken } } } = response2.data;

    const response3 = await axios.post('http://localhost:8080/graphql', {
      query: `
            mutation {
                createTeam(name: "Team Canada") {
                    ok
                    team {
                        name
                    }
                }
            }
        `,
    }, {
      headers: {
        'x-token': token,
        'x-refresh-token': refreshToken,
      },
    });

    expect(response3.data).toMatchObject({
      data: {
        createTeam: {
          ok: true,
          team: {
            name: 'Team Canada',
          },
        },
      },
    });
  });
});
