import chai from 'chai'
import chaiHttp from "chai-http";

chai.use(chaiHttp)

const {expect} = chai
const app = 'localhost:8000'

describe('receivers', function () {
    let createdReceiver = null
    let server = null
    let db = null

    before(() => {
        process.env.DB = ':memory:'
        server = require('../server').server
        db = require('../server').db
    })

    beforeEach(function (done) {
        switch (this.currentTest.title) {
            case 'GET /receivers - retrieves all receivers':
                db.run("INSERT INTO receivers (name, ric) VALUES " +
                    "('FFW Mellensee', " + Math.floor(Math.random() * (1e7 - 1e6) + 1e7) + ")," +
                    "('FFW Mellensee', " + Math.floor(Math.random() * (1e7 - 1e6) + 1e7) + ")," +
                    "('FFW Mellensee', " + Math.floor(Math.random() * (1e7 - 1e6) + 1e7) + ")," +
                    "('FFW Mellensee', " + Math.floor(Math.random() * (1e7 - 1e6) + 1e7) + ")," +
                    "('FFW Mellensee', " + Math.floor(Math.random() * (1e7 - 1e6) + 1e7) + ")"
                )

                done()
                break
            default:
                done()
        }
    })

    after((done) => {
        delete require.cache[require.resolve( '../server' )]
        server.close()
        done()
    })

    it('POST /receivers - creates a receiver', (done) => {
        chai.request(app)
            .post('/receivers')
            .send({
                name: '',
                ric: ''
            })
            .end((err, res) => {
                expect(res.status).to.equal(400)
            })

        chai.request(app)
            .post('/receivers')
            .send({
                name: 'FFW Mellensee',
                ric: 1234512
            })
            .end((err, res) => {
                expect(res.body.id).to.not.be.null
                expect(res.status).to.equal(201)

                createdReceiver = res.body.id

                done()
            })
    });

    it('GET /receivers/:id - retrieves a created receiver by id', (done) => {
        chai.request(app)
            .get('/receivers/' + createdReceiver)
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body).to.deep.equal({id: createdReceiver, name: 'FFW Mellensee', ric: 1234512})

                done()
            })
    });

    it('PATCH /receivers - updates receiver', (done) => {
        chai.request(app)
            .patch('/receivers')
            .send({id: createdReceiver, name: 'FFW New Mellensee', ric: 1000000})
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body).to.deep.equal({updated: 1})
            })

        chai.request(app)
            .get('/receivers/' + createdReceiver)
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body).to.deep.equal({id: createdReceiver, name: 'FFW New Mellensee', ric: 1000000})

                done()
            })
    });

    it('DELETE /receivers/:id - deletes a receiver', (done) => {
        chai.request(app)
            .delete('/receivers/' + createdReceiver)
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body).to.deep.equal({deleted: 1})
            })

        chai.request(app)
            .get('/receivers/' + createdReceiver)
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body).to.be.empty

                done()
            })
    });

    it('GET /receivers - retrieves all receivers', (done) => {
        chai.request(app)
            .get('/receivers')
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                expect(res.body.rows.length).to.equal(5)

                done()
            })
    });
})