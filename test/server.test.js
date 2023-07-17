const app = require("../src/app")
const supertest = require("supertest")
const request = supertest(app)

test("A aplicação deve responder na porta 3131", () => {
    
    return request.get("/").then(res => {
        let status = res.statusCode
        expect(status).toBe(200)
    }).catch(err => {
        fail(err)
    })
})