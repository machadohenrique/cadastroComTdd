let express = require("express");
let app = express();
let mongoose = require("mongoose");
let user = require("./models/User");
let product = require("./models/Product");
let bcrypt = require("bcrypt");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/lojaProdutos", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //console.log("Conectado com banco");
    }).catch((err) => {
        console.log(err);
    })


let User = mongoose.model("User", user);
let Product = mongoose.model("Product", product);


app.get("/", (req, res) => {
    res.json({});
});

app.post("/user", async (req, res) => {

    if (req.body.name == "" || req.body.email == "" || req.body.password == "") {
        res.sendStatus(400);
        return;
    }

    try {
        let user = await User.findOne({ "email": req.body.email });

        if (user != undefined) {
            res.statusCode = 400;
            res.json({ error: "Email ja cadastrado" });
            return;
        }

        let password = req.body.password;
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        let newUser = new User({ name: req.body.name, email: req.body.email, password: hash });
        await newUser.save();
        res.json({ email: req.body.email });

    } catch (err) {
        res.sendStatus(500);
    }
});

app.post("/product", async (req, res) => {
    try {
        if (req.body.nameProduct == "" || req.body.price == "" || req.body.description == "") {
            res.sendStatus(400);
            return;
        }

        let newProduct = new Product({ nameProduct: req.body.nameProduct, price: req.body.price, description: req.body.description })
        await newProduct.save();
        res.json({ nameProduct: "Pendrive" });

    } catch (err) {
        res.sendStatus(500);
    }
})


app.delete("/product/:nameProduct", async (req, res) => {
    await Product.deleteOne({ "nameProduct": req.params.nameProduct });
    res.sendStatus(200);
})

app.delete("/user/:email", async (req, res) => {
    await User.deleteOne({ "email": req.params.email });
    res.sendStatus(200);
})


module.exports = app;