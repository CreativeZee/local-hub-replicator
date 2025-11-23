
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());
let isConnected = false;
const PORT = process.env.PORT || 5000;
// mongoose.connect('mongodb://localhost:27017/local-hub')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));
async function connectDB() {
  if (isConnected) return;
  console.log("Connecting to MongoDB at:", process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}

app.get("/test", async (req, res) => {
  await connectDB();
  res.json({ message: "Backend connected to MongoDB!" });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

// MongoDB connection middleware for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    res.status(500).json({ msg: "MongoDB connection error", error: err.message });
  }
});


app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
app.use('/marketplace', require('./routes/marketplace'));
app.use('/events', require('./routes/events'));
app.use('/local-news', require('./routes/localNews'));
app.use('/groups', require('./routes/groups'));
app.use('/profile', require('./routes/profile'));
app.use('/news', require('./routes/news'));


// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports = app;

