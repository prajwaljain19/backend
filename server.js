require("dotenv").config();
const express = require("express");
const connectDB = require("./Config/db");
const chatbotRoutes = require("./routes/chatbotRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.use("/api/chatbot", chatbotRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
