let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let mainUser = { name: "Gabriel Henrique Machado", email: "gabriel@gmail.com", password: "123456" }

beforeAll(() => {

    return request.post("/user")
        .send(mainUser)
        .then(res => { })
        .catch(err => { console.log(err) })

})


afterAll(() => {

    return request.delete("/user" + mainUser)
        .then(res => { })
        .catch(err => { console.log(err) })

})


describe("Cadastro de Usuario", () => {
    test("Deve cadastrar um usuario com sucesso", () => {

        let time = Date.now();
        let email = `${time}@gmail.com`
        let user = { name: "Gabriel", email, password: "123456" }

        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.email).toEqual(email);
            }).catch(err => {
                fail(err);
            });
    })

    test("Deve impedir que um usuario se cadastre com os dados vazios", () => {
        let user = { name: "", email: "", password: "" };

        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400);
            }).catch(err => {
                fail(err);
            });
    })

    test("Deve impedir que um usuario se cadastre com um email repetido", () => {

        let time = Date.now();
        let email = `${time}@gmail.com`
        let user = { name: "Gabriel", email, password: "123456" }

        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.email).toEqual(email);

                return request.post("/user")
                    .send(user)
                    .then(res => {
                        expect(res.statusCode).toEqual(400);
                        expect(res.body.error).toEqual("Email ja cadastrado");
                    }).catch(err => {
                        fail(err);
                    })
            }).catch(err => {
                fail(err);
            });
    })

});