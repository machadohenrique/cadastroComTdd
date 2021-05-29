let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let mainProduct = { nameProduct: "Pendrive", price: "10.00R$", description: "Pendrive de 8gb" }

beforeAll(() => {
    return request.post("/product")
        .send(mainProduct)
        .then(res => { })
        .catch(err => { console.log(err) })
})


afterAll(() => {
    return request.delete("/product" + mainProduct)
        .then(res => { })
        .catch(err => { console.log(err) })
})


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

    test("Deve impedir que o usuario cadastre produtos repetidos", () => {
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
                        expect(res.body.error).toEqual("Produto ja cadastrado");
                    })
            }).catch(err => {
                fail(err);
            });

    });
});
