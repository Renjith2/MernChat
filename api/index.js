

const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const jwtsecret = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));

app.get('/test', (req, res) => {
  res.json('test ok');
});

app.listen(4000, () => {
  console.log("Server is on !!");
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: 'Password must be a string' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const createdUser = await User.create({ username, password: hashedPassword });
    jwt.sign({ userId: createdUser._id, username }, jwtsecret, {}, (err, token) => {
      if (err) {
        console.error("JWT sign error: ", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
        id: createdUser._id,
        username: createdUser.username,
      });
    });
  } catch (error) {
    console.error("Registration error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/profile', (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtsecret, {}, (err, userData) => {
      if (err) {
        console.error("JWT verification error: ", err);
        return res.status(401).json("Invalid token");
      }
      res.json(userData);
    });
  } else {
    res.status(401).json("No token");
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      const passok = bcrypt.compareSync(password, foundUser.password);
      if (passok) {
        jwt.sign({ userId: foundUser._id, username }, jwtsecret, {}, (err, token) => {
          if (err) {
            console.error("JWT sign error: ", err);
            return res.status(500).json({ message: "Internal server error" });
          }
          res.cookie('token', token, { sameSite: 'none', secure: true }).json({
            id: foundUser._id
          });
        });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    } else {
      res.status(401).json({ message: "Invalid username" });
    }
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
