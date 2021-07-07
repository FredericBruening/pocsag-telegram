import chai from 'chai'
import chaiHttp from "chai-http";

chai.use(chaiHttp)

const {expect} = chai
const app = 'localhost:8000'

describe('rptix test', function () {
    let server = null
    let db = null

    before(() => {
        process.env.DB = ':memory:'
        server = require('../server').server
        db = require('../server').db
    })

    after((done) => {
        delete require.cache[require.resolve( '../server' )]
        server.close()
        done()
    })

    it('POST /send-telegram - send a telegram using rptix', (done) => {
        chai.request(app)
            .post('/send-telegram')
            .send({
                message: 'Test-Message',
                receivers: [1234567, 7645321]
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                done()
            })
    });
})