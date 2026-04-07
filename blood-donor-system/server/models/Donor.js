import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  },
  fcmTokens: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const Donor = mongoose.model('Donor', donorSchema);
export default Donor;
