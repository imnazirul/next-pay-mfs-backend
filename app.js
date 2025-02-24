import express from "express"
import UserRouter from "./routes/user.routes.js";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/users", UserRouter)

app.listen(7000, () => {
  console.log("Server is running on port http://localhost:7000");
})

export default app;