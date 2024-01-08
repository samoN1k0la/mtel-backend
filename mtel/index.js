import express from 'express';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import router from './userRouter.js';
import Person from './user.js';
import messageRouter from "./messagesRouter.js"
import Message from './messages.js';

const app = express();
const url = 'mongodb://127.0.0.1:27017';
const clientMongo = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectAndPerformOperations() {
    const client = await clientMongo;
    client.close();
}

  connectAndPerformOperations();
  
  mongoose.connect('mongodb://127.0.0.1:27017/User', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });
  
  const db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // READ

  app.get("/",(request,response) => response.send("a"))
  app.use('/', router);

  app.get("/get/:email", async (request,response) => {
    try{
      const userEmail = request.params.email;
      const user = await Person.find({email: userEmail})
      
      if(!user) {
        return response.status(404).json({ error: 'User not found' });
      }
      response.json(user);
   }
    catch (error) {
      response.status(500).json({ message: error.message });
    }
  })

  app.get("/nesto/e/getid/:id", async (request, response) => {
    try {
      const userId = request.params.id
      const user = await Person.findById(userId);
      
      if (!user) {
        return response.status(404).json({ error: 'User not found' })
      }
    
      response.json(user);
    } catch (error) {
      response.status(500).json({ message: error.message })
    }
  })


  //CREATE

  //Client post
  app.use(express.json());

  app.post('/client_post', async (req, res) => {
    try {
      const { ime,prezime,lokacija,password,email } = req.body;
  
      const newPerson = new Person({
        ime,
        prezime,
        lokacija,
        password,
        email
      });
      const savedPerson = await newPerson.save();
  
      res.status(201).json(savedPerson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  //Expert post
  app.post('/expert_post', async (req, res) => {
    try {
      const { ime,prezime,lokacija,password,email,opis,rating,zanimanje } = req.body;

      const newPerson = new Person({
        ime,
        prezime,
        lokacija,
        password,
        email,
        opis,
        rating,
        zanimanje
      });
  
      const savedPerson = await newPerson.save();
  
      res.status(201).json(savedPerson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //DELETE

  app.delete('/delete/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      const deletedUser = await Person.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //UPDATE

  app.patch('/update/:id', async (req, res) => {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      const updatedUser = await Person.findByIdAndUpdate(
        userId,
        { $set: req.body }, 
        { new: true } 
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', updatedUser });
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Messages

  app.post('/messages', async (req, res) => {
    try {
      const { sender_id,receiver_id, message } = req.body;

      const newMessage = new Message({
         sender_id,
         receiver_id,
         message
      });
  
      const savedMessage = await newMessage.save();
  
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.use('/', messageRouter);

