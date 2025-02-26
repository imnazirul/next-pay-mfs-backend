import { Router } from "express";
import { sendMoney, cashIn, cashOut, GetUserTransactions, GetAllTransactions, GetTotalMoney, RequestBalance, PatchRequestBalance, GetBalanceRequest, GetUserRequestBalance } from "../controllers/transaction.controller.js";
import Authorize from "../middleware/auth.middleware.js";
import AgentAuthorize from "../middleware/agent.middleware.js";
import AdminAuthorize from "../middleware/admin.middleware.js";

const TransactionRouter = Router()

//user routes
TransactionRouter.post("/send-money", Authorize, sendMoney)
TransactionRouter.post("/cash-out", Authorize, cashOut)
//get transactions for user
TransactionRouter.get("/", Authorize, GetUserTransactions)


//agent routes
TransactionRouter.post("/cash-in", AgentAuthorize, cashIn)
TransactionRouter.post("/balance-requests", AgentAuthorize, RequestBalance)
TransactionRouter.post("/balance-requests/:id", AgentAuthorize, GetUserRequestBalance)


//admin routes
TransactionRouter.patch("/balance-requests/:id", AdminAuthorize, PatchRequestBalance)
TransactionRouter.get("/balance-requests", AdminAuthorize, GetBalanceRequest)
//get transactions for admin
TransactionRouter.get("/admin", AdminAuthorize, GetAllTransactions)
//get total money in the system
TransactionRouter.get('/total', AdminAuthorize, GetTotalMoney)

export default TransactionRouter;