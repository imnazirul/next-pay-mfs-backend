import { Router } from "express";

const authRouter = Router()

authRouter.post("/sign-up", (req, res) => {
    const {name, email, mobile, kind, pin, nid} = req.body;
    console.log(name, email, mobile, kind, pin, nid)
    res.send("Sign up route")
})



export default authRouter;