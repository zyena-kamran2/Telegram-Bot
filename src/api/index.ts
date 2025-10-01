import express from "express";
import adminRoutes from "./adminRoutes";

const app = express();
app.use(express.json());

app.use("/", adminRoutes);

export default app;
