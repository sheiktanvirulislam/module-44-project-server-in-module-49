const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { initializeApp } = require('firebase-admin/app');
const { MongoClient } = require('mongodb');

const admin = require('firebase-admin')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujt7d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

var serviceAccount = require("./configs/special-ecommerce-site-firebase-adminsdk-tq4i1-9fed467fb8.json");

initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});














app.get('/', (req, res) => {
    res.send("hello world")
})
app.use(cors())
app.use(bodyParser.json())


const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const bookingCollection = client.db("Burj-Al-Arab").collection("Booking");
  console.log("connection established")
  app.get("/bookingData",(req,res)=>{
    const bearer = req.headers.authorization 
    res.set({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
  });
    if(bearer && bearer.startsWith('Bearer ')){
       const idToken = bearer.split(' ')[1]
       
       console.log({idToken})
      
       admin.auth().verifyIdToken(idToken)
            .then((decodedToken) => {
            const tokenEmail = decodedToken.email;
            const queryEmail = req.query.email
            if (tokenEmail == queryEmail) {
              bookingCollection.find({email: queryEmail})
              .toArray((err,documents)=>{
                res.status(200).send(documents)
              })
            }
          
            else{
                   res.status(401).send("unauthorized Access")
            }
  })
  .catch((error) => {
    
  });
       
      }
      else{
          res.status(401).send('unauthorized Access')  
        
      }
  
    
    
    
    
  })
  
  
  app.post("/addBooking",(req, res) => {
    const newBooking = req.body;
    
    bookingCollection.insertOne(newBooking)
    .then(result => console.log("data sent"))
    console.log(newBooking)
  })
  
});
app.listen("4000",()=>{console.log("server running...")})