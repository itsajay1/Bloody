import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  name: {
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
  available: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Donor = mongoose.model('Donor', donorSchema);
export default Donor;
