const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://technologyElec:pXarhfvh9W68NK2f@cluster0.8wqrrau.mongodb.net/?retryWrites=true&w=majority";

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
        const productsCollection = client.db('TechnologyElec').collection('Addproducts')
        const addCartCollection = client.db('TechnologyElec').collection('addCart')

        // post(add products) products
        app.post('/products', async (req, res) => {
            const newproduct = req.body;
            const result = await productsCollection.insertOne(newproduct)
            res.send(result)
        })

        // Get all products
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray()
            res.send(result)
        })

        // Get single products
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const result = await productsCollection.findOne({ _id: new ObjectId(id) })
            res.send(result)
        })

        // addCart in database(post)
        app.post('/addcart', async (req, res) => {
            const newpusers = req.body;
            const result = await addCartCollection.insertMany(newpusers)
            res.send(result)
        })
        // Get add cart data
        app.get('/addcart/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await addCartCollection.find(query).toArray()
            res.send(result)
        })

        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})