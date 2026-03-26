import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  bloodGroup: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Request = mongoose.model('Request', requestSchema);
export default Request;
