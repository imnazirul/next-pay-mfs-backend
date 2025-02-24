import express from "express"
import authRouter from "./routes/auth.routes.js";
import { PORT } from "./config/env.js";
import errorMiddleware from "./middleware/error.middleware.js";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/auth", authRouter)
app.use(errorMiddleware)

app.get("/", (req, res) => {
  console.log("Welcome to the MFS API");
  res.send("Welcome to the MFS API");
}
)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})

export default app;