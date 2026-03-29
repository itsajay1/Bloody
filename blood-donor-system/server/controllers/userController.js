import User from '../models/User.js';
import Donor from '../models/Donor.js';
import Hospital from '../models/Hospital.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (any role)
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { 
      name, email, password, role, 
      // Donor fields
      bloodGroup, phone, age, location, lastDonationDate,
      // Hospital fields
      hospitalName, address, contactPerson 
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Role validation
    const validRoles = ['donor', 'hospital', 'admin'];
    if (!validRoles.includes(role)) {
      res.status(400);
      throw new Error('Invalid role specified');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    if (user) {
      // Create role-specific profile
      if (role === 'donor') {
        if (!bloodGroup || !phone || !age || !location) {
          await user.deleteOne();
          res.status(400);
          throw new Error('Donor profiles require bloodGroup, phone, age, and location');
        }
        await Donor.create({
          user: user._id,
          name,
          email,
          bloodGroup,
          phone,
          age,
          location,
          lastDonationDate
        });
      } else if (role === 'hospital') {
        if (!hospitalName || !address || !contactPerson || !phone) {
          await user.deleteOne();
          res.status(400);
          throw new Error('Hospital profiles require hospitalName, address, contactPerson, and phone');
        }
        await Hospital.create({
          user: user._id,
          hospitalName,
          address,
          contactPerson,
          phone
        });
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser };
