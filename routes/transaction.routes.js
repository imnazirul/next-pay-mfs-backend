import { Router } from "express";
import { sendMoney, cashIn, cashOut } from "../controllers/transaction.controller.js";
import Authorize from "../middleware/auth.middleware.js";
import AgentAuthorize from "../middleware/agent.middleware.js";

const TransactionRouter = Router()

TransactionRouter.post("/send-money", Authorize, sendMoney)
TransactionRouter.post("/cash-in", AgentAuthorize, cashIn)
TransactionRouter.post("/cash-out", Authorize, cashOut)

export default TransactionRouter;