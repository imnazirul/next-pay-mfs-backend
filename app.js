import express from "express"
const app = express();



app.use(express.json());

app.get("/", (req, res) => {
  return res.send({body: "Hello World"});
})

app.listen(7000, () => {
  console.log("Server is running on port https://localhost:7000");
})

export default app;