import express from "express";
import { config } from "dotenv";
import cors from "cors";
import bodyParser from 'body-parser';
import apiRoutes from "./routes/apiRoutes.js";

// Import the models from the index file
import index from "./models/index.js";
const { sequelize } = index;

config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// API routes
app.use("/api", apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

// Use alter:true to update tables without dropping them
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized');
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => console.error('Database sync failed:', err.message));