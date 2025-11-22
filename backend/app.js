
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

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
  console.log("MongoDB connected");
}
app.get("/test", async (req, res) => {
  await connectDB();
  res.json({ message: "Backend connected to MongoDB!" });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/marketplace', require('./routes/marketplace'));
app.use('/api/events', require('./routes/events'));
app.use('/api/local-news', require('./routes/localNews'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/news', require('./routes/news'));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports = app;

