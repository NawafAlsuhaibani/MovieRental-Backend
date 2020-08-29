const request = require('supertest');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');
let server;
let token;
let name;
beforeEach(() => { // before each test generate a new token + rename 'name'.
    token = new User().generateAuthToken();
    name = 'Genre1';
});
// This function sends a api call(post)to the server to: 
// creat a genre...pass the token as a verification and th name of the genre
const exec = async () => { 
    return await request(server)
        .post('/api/genres/')
        .set('-x-auth-token', token)
        .send({ name });
};
describe('/api/genre', () => {
    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => {
        server.close();
        await Genre.remove({});
    });
    describe('get/', () => {

        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'Genre1' },
                { name: 'Genre2' }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'Genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'Genre2')).toBeTruthy();
        });
    });
    describe('get/:id', () => {

        it('should return a genre if a genre id is valid', async () => {
            const genre = new Genre({ name });
            await genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });
    describe('post/', () => {

        it('should return 401 if user is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });


        it('should return 400 if genre is less than 5 charecter', async () => {
            name = 1234;
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is moree than 50 charecter', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            const res = await exec();
            const genre = await Genre.find({ name });
            expect(genre).not.toBeNull();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    })
});
