const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors')
const corsOptions = require("./Config/corsOptions");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

app.use(cors(corsOptions))

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// const allowedOrigins = [
//   "https://chat-app-rho-ten-58.vercel.app",
//   "http://localhost:3000",
// ];

// // CORS middleware
// app.use(cors({
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// Middleware to parse JSON body
app.use(express.json());

// MongoDB connection
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is connected to the Database");
  } catch (err) {
    console.log("Error connecting to database", err.message);
  }
};
connectDb();

app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middleware
app.use(notFound);
app.use(errorHandler);

// CORS debugging log (optional)
app.use((req, res, next) => {
  console.log("CORS headers are being applied...");
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
