import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
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
  lastDonationDate: {
    type: Date,
  },
  donationHistory: [
    {
      date: { type: Date, default: Date.now },
      hospital: { type: String, required: true }
    }
  ],
  available: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Donor = mongoose.model('Donor', donorSchema);
export default Donor;
