require('dotenv').config();
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

// Connect to DB once on startup instead of on every request

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
app.use('/reviews', require('./routes/reviews.cjs'));
app.use('/services', require('./routes/services.cjs'));
app.use('/activities', require('./routes/activities.cjs'));
// app.use('/users', require('./routes/users.cjs'));
app.use('/conversations', require('./routes/conversations.cjs'));
app.use('/messages', require('./routes/messages.cjs'));
const PORT = process.env.PORT || 4000;

// Start the server after attempting DB connection. If DB connection fails
// the process will exit with a non-zero code so the issue is visible.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server due to DB connection error.');
    // Exit so container/pm2/systemd can detect failure and restart if configured
    process.exit(1);
  });

module.exports = app;