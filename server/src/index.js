import express from "express";
import { config } from "dotenv";
import authRoutes from "./router/authRoutes.js";
import ConnectDb from "../Db/ConnectDb.js";
const app = express();
config();

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
      ConnectDb()
  console.log(`Server running on http://localhost:${PORT}`);

});
