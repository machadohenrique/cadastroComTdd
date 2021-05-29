let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);


describe("Cadastro de Produto", () => {
    test("Deve cadastrar um produto com sucesso", () => {
        let nameProduct = "Pendrive";
        return request.post("/product")
            .send(nameProduct)
            .then(res => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.nameProduct).toEqual(nameProduct);
            }).catch(err => {
                fail(err);
            })

    })

    test("deve impedir que o usuario cadastre produtos repetidos", () => {
        let nameProduct = { nameProduct: "Pendrive" };

        return request.post("/product")
            .send(nameProduct)
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.nameProduct).toEqual(nameProduct);

                return request.post("/product")
                    .send(nameProduct)
                    .then(res => {
                        expect(res.statusCode).toEqual(400);
                        expect(res.body.error).toEqual("produto ja cadastrado");
                    })
            }).catch(err => {
                fail(err);
            })

    })




})
