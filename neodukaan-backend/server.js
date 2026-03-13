import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./app.js"; // 👈 Importing the Express engine

// 1. Load Environment Variables
dotenv.config();

// 2. Connect to MongoDB Atlas [cite: 2, 24]
connectDB();

// 3. Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log( 
    `🚀 Server listening on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
