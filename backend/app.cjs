const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get("/test", (req, res) => {
  res.json({ message: "Backend is alive" });
});

app.use('/auth', require('./routes/auth.cjs'));
app.use('/posts', require('./routes/posts.cjs'));
app.use('/marketplace', require('./routes/marketplace.cjs'));
app.use('/events', require('./routes/events.cjs'));
app.use('/local-news', require('./routes/localNews.cjs'));
app.use('/groups', require('./routes/groups.cjs'));
app.use('/profile', require('./routes/profile.cjs'));
app.use('/news', require('./routes/news.cjs'));

module.exports = app;
