const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.qe6izo7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
   

    const dataBase = client.db("Programing-heroJobTask");
    // add a nuew user.
    const userCollection = dataBase.collection("users");
    app.post("/add_a_user", async (req, res) => {
      const userData = req.body;
      if (userData.email) {
        const result = await userCollection.find().toArray();

        const isexisted = result.find((item) => item.email === userData.email);
        console.log(isexisted);
        if (!isexisted) {
          const result = await userCollection.insertOne(userData);
          res.send(result);
        } else {
          res.send(false);
        }
      }
    });

    // make secure login.
    app.post("/login",async(req,res)=>{
      const userData=req.body
      // checking is this user valid or not.
      if(userData.email){
        const userslist=await userCollection.findOne({email:userData.email})
        if(userslist){
          if(userslist.password===userData.password){
            res.send(true)
          }
          else{
            res.send(false)
          }
        }
        else{
          res.send(false)
        }
      }
    })

    // home of this api.
    app.get("/", async(req, res) => {
      const result= await userCollection.find().toArray()
      res.send(result)
    });

    // end......................
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`this server is running at http://localhost:${port}`);
});
