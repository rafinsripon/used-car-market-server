const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

require('dotenv').config()

// middlewares
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0mxdn2v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const usersCollection = client.db('usecarmarket').collection('users')
        const categoriesCollection = client.db('usecarmarket').collection('categories')
        const categoryCollection = client.db('usecarmarket').collection('category')
        const bookingsCollection = client.db('usecarmarket').collection('bookings')

        //get categories
        app.get('/categories', async(req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray()
            res.send(categories);
        })

        //all category
        app.get('/category', async(req, res) => {
          const query = {};
          const category = await categoryCollection.find(query).toArray()
          res.send(category)
        })

        //get single data
        app.get('/category/:id', async(req, res) => {
            const id = req.params.id;
            const query = {category_id:(id)}
            const category = await categoryCollection.find(query).toArray();
            res.send(category);
        })
        //boooking items saved
        app.post('/bookings', async(req, res) => {
          const bookings = req.body;
          const result = await bookingsCollection.insertOne(bookings)
          res.send(result);
        })

        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result);
        })
  
        console.log('Database Connected yes...')
    } 
    finally {

    }
  }
  
  run().catch(err => console.error(err))
  
  app.get('/', (req, res) => {
    res.send('Server is running...')
  })
  
  app.listen(port, () => {
    console.log(`Server is running...on ${port}`)
  })
  


