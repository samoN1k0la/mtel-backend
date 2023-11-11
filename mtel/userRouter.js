import express from 'express';
const router = express.Router();
import Person from './user.js';

router.get('/persons', async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;