const request = require('supertest');
const { User } = require('../../../models/user');
const { Genre } = require('../../../models/genre');
let server;
let token;
let name;
beforeEach(() => { // before each test generate a new token + rename 'name'.
    token = new User().generateAuthToken();
    name = 'Genre1';
});
// This function sends a api call(post)to the server to: 
// creat a genre...pass the token as a verification and th name of the genre
describe('/ POST', () => {
    const exec = () => {
        return request(server)
            .post('/api/genres/')
            .set('-x-auth-token', token)
            .send({ name });
    };

    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        await Genre.remove({});
        server.close();
    });
    it('should return 401 when no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);

    });
    it('should return 400 when invalid token is provided', async () => {
        token = null;
        const res = await exec();
        expect(res.status).toBe(400);

    });
    it('should return 200 when a valid token is provided', async () => {
        const res = await exec();
        expect(res.status).toBe(200);

    });
});