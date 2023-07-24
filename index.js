const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT | 5000

app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ddbcqih.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        const usersCollection = client.db('collegeBayDB').collection('users');
        const collegesCollection = client.db('collegeBayDB').collection('colleges');
        const imagesCollection = client.db('collegeBayDB').collection('galary');
        const reviewsCollection = client.db('collegeBayDB').collection('reviews');
        const applicationCollection = client.db('collegeBayDB').collection('appliedColleges');


        // users Collection Works
        app.post('/users', async (req, res) => {
            const users = req.body;
            const query = { email: users.email }
            const loggedInUser = await usersCollection.findOne(query);
            if (loggedInUser) {
                return res.send({ message: 'Already logged In' })
            }
            const result = await usersCollection.insertOne(users);
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        // Galary Collection 
        app.get('/galary', async (req, res) => {
            const result = await imagesCollection.find().toArray();
            res.send(result)
        })

        // Reviews Collection 
        app.post('/reviews', async (req, res) => {
            const addedreviews = req.body;
            const result = await reviewsCollection.insertOne(addedreviews);
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result)
        })

        // colleges collection works
        app.get('/colleges', async (req, res) => {
            const result = await collegesCollection.find().toArray();
            res.send(result)
        })

        app.get('/colleges/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)};
            const result = await collegesCollection.findOne(query);
            res.send(result)
        })

        // Applied Colleges 
        app.post('/appliedColleges', async (req, res) => {
            const appliedColleges = req.body;
            const result = await applicationCollection.insertOne(appliedColleges);
            res.send(result)
        })

        app.get('/appliedColleges/email', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await applicationCollection.find(query).toArray();
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.post('/users', async (req, res) => {
    const users = req.body;
    const query = { email: users.email }
    const loggedInUser = await usersCollection.findOne(query);
    if (loggedInUser) {
        return res.send({ message: 'Already logged In' })
    }
    const result = await usersCollection.insertOne(users);
    res.send(result)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})