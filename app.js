import express from "express"
import authRouter from "./routes/auth.routes.js";
import { PORT } from "./config/env.js";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/auth", authRouter)
// app.use("/api/v1/users", UserRouter)

app.get("/", (req, res) => {
  res.send("Welcome to the MFS API");
}
)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})

export default app;