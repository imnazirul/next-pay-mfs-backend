import { Router } from "express";
import { signIn, signUp, signOut,tokenSignOut } from "../controllers/auth.controller.js";
import Authorize from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post("/sign-up", signUp)
authRouter.post("/sign-in", signIn)
authRouter.post("/sign-out", signOut)
authRouter.post("/token-sign-out",Authorize, tokenSignOut)

export default authRouter;