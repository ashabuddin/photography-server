const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxbrw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json())
app.use(cors())

const port = 5000;

app.get('/',(req, res) => {
    res.send('mongodb started')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 client.connect(err => {
  const photographyCollection = client.db("photography").collection("serviceEvent");
  const orderCollection = client.db("photography").collection("order");

  app.post("/addService" , (req,res) => {
      const serviceEvent = req.body;
      console.log(serviceEvent);
      photographyCollection.insertOne(serviceEvent)
      .then( result => {
          res.send(result.insertedCount>0)
        // res.redirect('/')
      })
  })

  app.get("/serviceEvent",(req, res) =>{
    photographyCollection.find()
    .toArray((err, serviceEvent) => {
        res.send(serviceEvent)
    })
  })

  app.get('/service/:id',(req,res)=>{
    photographyCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  
  app.delete('/delete/:id',(req,res)=> {
    const id = ObjectId(req.params.id)
    photographyCollection.deleteOne({_id: id})
    .then(document =>{
      res.send(document.deletedCount>0)
    })
  })

  app.post('/addOrder', (req,res) => {
    const newOrder = req.body;
     orderCollection.insertOne(newOrder)
    .then(result => {
      //console.log('inserted',result.insertedCount );
      res.send(result.insertedCount > 0)
    })
   })

//    app.get('/order', (req, res) => {
//     console.log(req.query.email); 
//     orderCollection.find({email:req.query.email})
//         .toArray((err, docs) =>{
//            res.send(docs)
//         })
// })
app.get('/order',(req,res) => {
  console.log(req.query.email); 
  orderCollection.find({email:req.query.email})
  .toArray((err, document) => {
    res.send(document)
  })
})

app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  photographyCollection.find({ email: email })
      .toArray((err, admin) => {
          res.send(admin.length > 0);
      })
})



//   app.patch('/update/:id', (req, res) => {
//     toDoCollection.updateOne({_id: ObjectId(req.params.id)},
//         {
//           $set:{name:req.body.name,email:req.body.email}
//         }
//     ).then(result => {
//         res.send(result.modifiedCount > 0)
//     })
// })
  

 });


app.listen(process.env.PORT || port)