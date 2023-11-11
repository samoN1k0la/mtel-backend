import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  ime: String,
  prezime: String,
  lokacija: String,
  password: String,
  email: String,
  opis: String,
  rating: Number,
  zanimanje: String,
});

const Person = mongoose.model('User', personSchema);

export default Person;