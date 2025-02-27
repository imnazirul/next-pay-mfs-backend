import express from "express"
import authRouter from "./routes/auth.routes.js";
import { PORT } from "./config/env.js";
import errorMiddleware from "./middleware/error.middleware.js";
import connectToDatabase from "./database/mongodb.js";
import TransactionRouter from "./routes/transaction.routes.js";
import UserRouter from "./routes/user.routes.js";
import AgentRouter from "./routes/agent.routes.js";
import cors from "cors"
const app = express();



app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
await connectToDatabase()


app.use("/api/v1/users", UserRouter)
app.use("/api/v1/agents", AgentRouter)
app.use("/api/v1/transactions", TransactionRouter)
app.use("/api/v1/auth", authRouter)
app.use(errorMiddleware)

app.get("/", (req, res) => {
  console.log("Welcome to the MFS API");
  res.send("Welcome to the MFS API");
}
)

app.listen(PORT, async() => {
  console.log(`Server is running on port http://localhost:${PORT}`);

})

export default app;