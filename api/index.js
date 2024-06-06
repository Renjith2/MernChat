


const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const ws = require('ws');

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

const server = app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
  console.log("New WebSocket connection");


  connection.on('close', () => {
    console.log('WebSocket connection closed');
  });

  connection.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split(';').find(str => str.trim().startsWith('token='));
    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtsecret, {}, (err, userData) => {
          if (err) {
            console.error("JWT verification error: ", err);
          } else {
           const {userId,username}=userData;
           connection.userId=userId;
           connection.username=username;
          }
        });
      } else {
        console.log("Token not found in cookies");
      }
    } else {
      console.log("Token cookie string not found");
    }
  } else {
    console.log("No cookies found in headers");
  }
  console.log([...wss.clients].map(c=>c.username));
  [...wss.clients].forEach(client =>{
    client.send(JSON.stringify({
      online:[...wss.clients].map(c=>(
        {userId:c.userId,username:c.username}
      ))
    }))
  })
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