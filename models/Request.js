import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  store_url: {
    type: String,
    required: [true, 'Store URL is required'],
    trim: true,
  },
  monthly_salary: {
    type: String, // Changed from Number to String to accept any text
    required: [true, 'Monthly salary is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model('Request', requestSchema);

export default Request;
