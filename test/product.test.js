let app = require("../src/app");
let supertest = require("supertest");
let request = supertest(app);

let mainProduct = { nameProduct: "HD", price: "150.00R$", description: "HD de 1TB" }

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
        let time = Date.now();
        let productCode = `${time}`
        let info = { nameProduct: "Pendrive", price: "10.00R$", description: "Pendrive de 8gb", productCode };
        return request.post("/product")
            .send(info)
            .then(res => {
                expect(res.statusCode).toEqual(200)
                expect(res.body.productCode).toEqual(productCode);
            }).catch(err => {
                fail(err);
            })

    })
});

test("Deve impedir que o usuario cadastre produtos repetidos", () => {
    let time = Date.now();
    let productCode = `${time}`
    let info = { nameProduct: "Pendrive", price: "10.00R$", description: "Pendrive de 8gb", productCode };

    return request.post("/product")
        .send(info)
        .then(res => {
            expect(res.statusCode).toEqual(200)
            expect(res.body.productCode).toEqual(productCode);


            return request.post("/product")
                .send(info)
                .then(res => {
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.error).toEqual("Produto ja cadastrado");
                }).catch(err => {
                    fail(err);
                })
        }).catch(err => {
            fail(err);
        })
})

describe("Cadastro de produtos vazios", () => {
    test("Deve evitar cadastro vazios", () => {
        let info = { nameProduct: "", price: "", description: "", productCode: "" }

        return request.post("/product")
            .send(info)
            .then(res => {
                expect(res.statusCode).toEqual(400)
            }).catch(err => {
                fail(err);
            })
    })
})