import chai from 'chai'
import chaiHttp from "chai-http";

chai.use(chaiHttp)

const {expect} = chai
const app = 'localhost:8000'

describe('rptix', function () {
    let server = null
    let db = null

    before(() => {
        process.env.DB = ':memory:'
        server = require('../server').server
        db = require('../server').db
    })

    after(() => server.close())

    it('POST /send - send a telegram using rptix', (done) => {
        chai.request(app)
            .post('/send')
            .send({
                message: '',
                receivers: []
            })
            .end((err, res) => {
                expect(res.status).to.be.equal(200)
                done()
            })
    });
})