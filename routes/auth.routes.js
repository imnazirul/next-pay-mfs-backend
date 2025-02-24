import { Router } from "express";
import { signIn, signUp, signOut } from "../controllers/auth.controller.js";
import Authorize from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post("/sign-up", signUp)
authRouter.post("/sign-in", signIn)
authRouter.post("/sign-out",Authorize, signOut)

export default authRouter;