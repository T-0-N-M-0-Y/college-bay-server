const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT | 5000

app.use(cors());
app.use(express.json())

// const verifyAccessWithJwtToken = (req, res, next) => {

//     const authorization = req.headers.authorization;

//     if (!authorization) {
//         return res.status(401).send({ error: true, message: 'unauthorized access' });
//     }

//     const accessToken = authorization.split(' ')[1];

//     jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => {
//         if (err) {
//             return res.status(401).send({ error: true, message: 'unauthorized access' });
//         }
//         req.decoded = decoded;
//         next();
//     })
// }


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

                // // Verify Admin Middleware 
                // const checkAdminOrUser = async (req, res, next) => {
                //     const email = req.decoded.email;
                //     const query = { email: email }
                //     const user = await usersCollection.findOne(query);
                //     if (user?.role !== 'admin' && user?.role !== 'user') {
                //         return res.status(403).send({ error: true, message: 'forbidden access!' })
                //     }
                //     next();
                // }
        
                // // Create jwt token
                // app.post('/jwt', (req, res) => {
                //     const user = req.body;
                //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                //     res.send({ accessToken });
                // })


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

        // app.patch('/users/admin/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) };
        //     const updateDoc = {
        //         $set: {
        //             role: 'admin'
        //         }
        //     }
        //     const result = await usersCollection.updateOne(filter, updateDoc);
        //     res.send(result);
        // })

            //   // Verify admin by email 
            //   app.get('/users/admin/:email', verifyAccessWithJwtToken, async (req, res) => {
            //     const email = req.params.email;
    
            //     if (req.decoded.email !== email) {
            //         return res.send({ admin: false })
            //     }
    
            //     const query = { email: email };
            //     const user = await usersCollection.findOne(query);
            //     const result = { admin: user?.role === 'admin' }
            //     res.send(result)
            // })



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