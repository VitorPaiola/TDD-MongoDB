const app = require("../src/app") // Importar a instância do aplicativo
const supertest = require("supertest") // chamar o supertest
const request = supertest(app) // Criar o objeto de requisição


let mainUser = { name: "name", email: "email@gmail.com", password: "pass" } 

// Inserir usuário x no banco
beforeAll(() => {

    return request.post("/user")
        .send(mainUser)
        .then(res => { })
        .catch(err => { console.log(err) })
})

// Remover o x do banco
afterAll(() => {
    return request.delete(`/user/${mainUser.email}`)
        .then(res => { })
        .catch(err => { console.log(err); })
})

describe("Cadastro de usuário", () => {
    test("Deve cadastrar um usuário com sucesso", () => {

        let time = Date.now()
        let email = `${time}@gmail.com`
        let user = { name: "name", email, password: "pass" }

        return request.post("/user")
            .send(user)
            .then((res) => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.email).toEqual(email)
            }).catch(err => {
                throw err
            })
    })

    test("Deve impedir que um usuário se cadastre com os dados vazios", () => {
        let user = { name: "", email: "", password: "" }

        return request.post("/user")
            .send(user)
            .then((res) => {
                expect(res.statusCode).toEqual(400)
            }).catch(err => {
                throw err
            })
    })

    test("Deve impedir que um usuário se cadastre com um e-mail repetido", () => {

        let time = Date.now()
        let email = `${time}@gmail.com`
        let user = { name: "name", email, password: "pass" }

        return request.post("/user")
            .send(user)
            .then((res) => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.email).toEqual(email)

                return request.post("/user")
                    .send(user)
                    .then(res => {
                        expect(res.statusCode).toEqual(400)
                        expect(res.body.error).toEqual("E-mail já cadastrado")
                    }).catch(err => {
                        throw err
                    })

            }).catch(err => {
                throw err
            })
    })

})

describe("Autenticação", () => {
    test("Deve me retornar um token quando logar", () => {
        return request.post("/auth")
            .send({ email: mainUser.email, password: mainUser.password })
            .then(res => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.token).toBeDefined()
            }).catch(err => {
                throw err
            })
    })

    test("Deve impedir que um usuário não cadastrado se logue", () => {

        return request.post("/auth")
            .send({ email: "umemailqualquer@qualquer.com", password: "anything" })
            .then(res => {
                expect(res.statusCode).toEqual(403)
                expect(res.body.errors.email).toEqual("E-mail não cadastrado")
            }).catch(err => {
                throw err
            })
    })

    test("Deve impedir que um usuário se logue com uma senha errada", () => {

        return request.post("/auth")
            .send({ email: mainUser.email, password: "errorpass" })
            .then(res => {
                expect(res.statusCode).toEqual(403)
                expect(res.body.errors.password).toEqual("Senha incorreta")
            }).catch(err => {
                throw err
            })
    })

})