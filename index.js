const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// name: vegists pass: W8HBJaphLOkihnbW
// token: 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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b2kqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);
client.connect((err) => {
  console.log("data base connected");

  
  const productCollection = client.db("vegist").collection("Products");
  const OrdersCollection = client.db("vegist").collection("Orders");
  const reviewCollection = client.db("vegist").collection("Review");
  const userCollection = client.db("vegist").collection("Users");

  app.get("/products/home", async (req, res) => {
    const cursor = productCollection.find({});
    const result = await cursor.limit(6).toArray();
    res.send(result);
    // console.log(result)
  });
  app.get("/products", async (req, res) => {
    const cursor = productCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
    // console.log(result)
  });

  //get one from service

  app.get("/products/single/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    if (id) {
      // console.log(id)
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
      // console.log(result)h
    }
  });
  //get one from service
  app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    if (id) {
      // console.log(id)
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
      // console.log(result)h
    }
  });

  //add poducts  by post method
  app.post("/products", async (req, res) => {
    const newProduct = req.body;

    const result = await productCollection.insertOne(newProduct);
    res.send(result);
    console.log(result);
  });
  //delete a service
  app.delete("/products/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const result = await productCollection.deleteOne({ _id: ObjectId(id) });
    // console.log(result)
    res.send(result);
  });
  app.delete("/products/:id", async (req, res) => {
    const result = await productCollection.deleteOne({ _id: ObjectId(id) });
    console.log(id);
    const id = req.params.id;
    // console.log(result)
    res.send(result);
  });

  app.get("/orders", async (req, res) => {
    const cursor = OrdersCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
    // console.log(result)
  });

  //cline orders post method

  app.post("/orders", async (req, res) => {
    const newOrders = req.body;
    const result = await OrdersCollection.insertOne(newOrders);
    res.send(result);
    console.log(result);
  });

  app.get("/orders/:email", async (req, res) => {
    const email = req.params.email;
    console.log(email);
    const result = await OrdersCollection.find({ email: email }).toArray(
      (er, result) => {
        console.log(er, result);
        res.send(result);
      }
    );
  });
  app.delete("/orders/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const result = await OrdersCollection.deleteOne({ _id: ObjectId(id) });
    console.log(result);
    res.send(result);
  });

  app.put("/orders/:id", async (req, res) => {
    const id = req.params.id;

    // console.log(id)
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        approved: "true",
      },
    };

    const result = await OrdersCollection.updateOne(filter, updateDoc, options);
    console.log("update", result);
    res.send(result);
  });

  app.get("/users", async (req, res) => {
    const result = await userCollection.find({}).toArray();
    res.send(result);
  });

  app.get("/users/:email", async (req, res) => {
    const email = req.params.email;
    const user = await userCollection.findOne({ email: email });
    let isAdmin = false;
    if (user?.role == "admin") {
      isAdmin = true;
    }
    res.json({ admin: isAdmin });
  });

  app.post("/users", async (req, res) => {
    const newUser = req.body;
    const result = await userCollection.insertOne(newUser);
    console.log(result);
    res.send(result);
  });

  app.put("/users", async (req, res) => {
    const user = req.body;
    console.log("put", user);
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    console.log(result);
    res.json(result);
  });

  app.put("/users/admin", async (req, res) => {
    const user = req.body;
    console.log(user);

    const filter = { email: user.adminEmail };

    const updateDoc = { $set: { role: "admin" } };
    const result = await userCollection.updateOne(filter, updateDoc);
    console.log(result);
    res.json(result);
  });

  app.post("/review", async (req, res) => {
    const newReview = req.body;
    const result = await reviewCollection.insertOne(newReview);
    res.send(result);
    console.log(result);
  });

  app.get("/review", async (req, res) => {
    const cursor = reviewCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
    // console.log(result)
  });

  app.get("/", (req, res) => {
    console.log("vegist server running....");
  });
});

app.listen(port, () => {
  console.log("listening from ", port);
});
