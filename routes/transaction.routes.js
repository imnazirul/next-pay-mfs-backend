import { Router } from "express";
import { sendMoney, cashIn } from "../controllers/transaction.controller.js";
import Authorize from "../middleware/auth.middleware.js";
import AgentAuthorize from "../middleware/agent.middleware.js";

const TransactionRouter = Router()

TransactionRouter.post("/send-money", Authorize, sendMoney)
TransactionRouter.post("/cash-in", AgentAuthorize, cashIn)

export default TransactionRouter;