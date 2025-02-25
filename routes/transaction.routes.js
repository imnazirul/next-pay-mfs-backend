import { Router } from "express";
import { sendMoney } from "../controllers/transaction.controller.js";
import Authorize from "../middleware/auth.middleware.js";

const TransactionRouter = Router()

TransactionRouter.post("/send-money",Authorize, sendMoney)

export default TransactionRouter;