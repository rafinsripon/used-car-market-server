const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0mxdn2v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
  try {
    const usersCollection = client.db("usecarmarket").collection("users");
    const categoriesCollection = client
      .db("usecarmarket")
      .collection("categories");
    const categoryCollection = client.db("usecarmarket").collection("category");
    const bookingsCollection = client.db("usecarmarket").collection("bookings");
    const advetiseCollection = client.db("usecarmarket").collection("advertise")

    //get categories
    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoriesCollection.find(query).toArray();
      res.send(categories);
    });

    //all category
    app.get("/category", async (req, res) => {
      const query = {};
      const category = await categoryCollection.find(query).toArray();
      res.send(category);
    });

    app.post("/category", async (req, res) => {
      const caregory = req.body;
      const result = await categoryCollection.insertOne(caregory);
      res.send(result);
    });

//delteed
    app.delete("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await categoryCollection.deleteOne(query);
      res.send(result);
    });

    //get single data
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { category_id: id };
      const category = await categoryCollection.find(query).toArray();
      res.send(category);
    });

    //booking specifin one email addresswala user--------------//
    app.get("/bookings", async (req, res) => {
      // const email = req.query.email;
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      // const query = {email: email}
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });

    //prayment single specific id
    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingsCollection.findOne(query);
      res.send(booking);
    });

    //boooking items saved
    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      const result = await bookingsCollection.insertOne(bookings);
      res.send(result);
    });

        //advertise data
        app.post('/advertise', async(req, res) => {
          const query = req.body;
          const result = await advetiseCollection.insertOne(query);
          res.send(result)
        })
        app.get('/advertise', async(req, res) => {
          const query = {}
          const advertise = await advetiseCollection.find(query).toArray()
          res.send(advertise)
        })
        
    //---------jwt token----------//
    //jwt token access
    app.get('/jwt', async(req, res) => {
      const email = req.query.email;
      const query = {email: email}
      const user = await usersCollection.findOne(query);
      if(user){
          const token = jwt.sign({email}, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '1h'});
          return res.send({accessToken: token});
      }
      res.status(403).send({accessToken: ''})
    })

    //all user get
    app.get("/users", async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    //sellel check
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    //all register users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //make admin role
    app.put("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //make make verify
    app.patch("/users/verify/:id", async(req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          verify: user.verify
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    })

    //user admin kina check
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const seller = await usersCollection.findOne(query);
      res.send({ isSeller: seller?.role === "seller" });
    });

    //user user
    app.get("/users/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isUser: user?.role === "user" });
    });


    //users delete
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });


    console.log("Database Connected yes...");
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`);
});
