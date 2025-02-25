import { Router } from "express";
import { sendMoney, cashIn, cashOut, GetUserTransactions, GetAllTransactions } from "../controllers/transaction.controller.js";
import Authorize from "../middleware/auth.middleware.js";
import AgentAuthorize from "../middleware/agent.middleware.js";
import AdminAuthorize from "../middleware/admin.middleware.js";

const TransactionRouter = Router()

TransactionRouter.post("/send-money", Authorize, sendMoney)
TransactionRouter.post("/cash-in", AgentAuthorize, cashIn)
TransactionRouter.post("/cash-out", Authorize, cashOut)

//get transactions for user
TransactionRouter.get("/", Authorize, GetUserTransactions)

//get transactions for admin
TransactionRouter.get("/admin", AdminAuthorize, GetAllTransactions)

export default TransactionRouter;