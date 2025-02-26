import { Router } from "express";
import { sendMoney, cashIn, cashOut, GetUserTransactions, GetAllTransactions, GetTotalMoney, RequestBalance, PatchRequestBalance, GetBalanceRequest, GetUserRequestBalance, GetAgentTransactions } from "../controllers/transaction.controller.js";
import Authorize from "../middleware/auth.middleware.js";
import AgentAuthorize from "../middleware/agent.middleware.js";
import AdminAuthorize from "../middleware/admin.middleware.js";

const TransactionRouter = Router()

//user routes
TransactionRouter.post("/send-money", Authorize, sendMoney)
TransactionRouter.post("/cash-out", Authorize, cashOut)
TransactionRouter.get("/user", Authorize, GetUserTransactions)

//agent routes
TransactionRouter.post("/cash-in", AgentAuthorize, cashIn)
TransactionRouter.post("/balance-requests", AgentAuthorize, RequestBalance)
TransactionRouter.get("/balance-requests-agent", AgentAuthorize, GetUserRequestBalance)
TransactionRouter.get("/agent", AgentAuthorize, GetAgentTransactions)

//common

//admin routes
TransactionRouter.patch("/balance-requests/:id", AdminAuthorize, PatchRequestBalance)
TransactionRouter.get("/balance-requests", AdminAuthorize, GetBalanceRequest)
TransactionRouter.get("/admin", AdminAuthorize, GetAllTransactions)
TransactionRouter.get('/total', AdminAuthorize, GetTotalMoney)

export default TransactionRouter;