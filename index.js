const express = require("express");
const cors = require("cors")

const app = express()
const port =process.env.port || 3000;


app.use(cors())
app.use(express.json())

// user= introCardUser
// pass= TaAIQQm5Q26sQC7K

const users = [{
    userName: 'this-is-name',
    name: 'this is name',
    email: 'email@mail.com',
    office: 'office name',
    position: 'positipomn',
    number_work: '+8524144',
    number_personal: '+852444'
  }];








const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://introCardUser:TaAIQQm5Q26sQC7K@cluster0.ltlan4m.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const userCollection = client.db("intro-data").collection("intro-users");

    app.get("/", (req,res) =>{
        res.send("welcome come to server")
    })

    app.get("/users/:user", async(req,res)=>{
    
        const userUrl = req.params.user
        console.log(userUrl)
        const UserInfo =await  userCollection.findOne({userName:userUrl  })

       
        if(!UserInfo){
            
            res.send({ errors:true })
        }
        res.send(UserInfo)
    })
    

    app.post("/newUser", async(req,res) =>{
        const newUser = req.body
        users.push(newUser)
        const result = await userCollection.insertOne(newUser)
        res.send({result,user:newUser.userName})
    })

    app.patch("/user/edit", async(req,res)=>{
        
        const userId = req.body._id
        const query = {_id: new ObjectId (userId)}
        const  updateDoc = {
            $set:{
                userName: req.body.userName,
                name: req.body.name,
                email: req.body.email,
                office: req.body.office,
                position: req.body.position,
                number_work: req.body.number_work,
                number_personal: req.body.number_personal
            }
        }
        const result = await userCollection.updateOne(query,updateDoc)
        res.send(result)
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

