import { Router } from "express";
import { PostTransaction, GetTransactions, GetAllTransactions, GetTotalMoney, RequestBalance, PatchRequestBalance, GetBalanceRequest, GetUserRequestBalance, GetTransaction } from "../controllers/transaction.controller.js";
import Authorize from "../middleware/auth.middleware.js";
import AgentAuthorize from "../middleware/agent.middleware.js";
import AdminAuthorize from "../middleware/admin.middleware.js";

const TransactionRouter = Router()

//common
TransactionRouter.post("/", Authorize, PostTransaction)
TransactionRouter.get("/", Authorize, GetTransactions)
TransactionRouter.get("/transactions/:id", Authorize, GetTransaction)

//agent routes
TransactionRouter.post("/balance-requests", AgentAuthorize, RequestBalance)
TransactionRouter.get("/balance-requests-agent", AgentAuthorize, GetUserRequestBalance)

//admin routes
TransactionRouter.patch("/balance-requests/:id", AdminAuthorize, PatchRequestBalance)
TransactionRouter.get("/balance-requests", AdminAuthorize, GetBalanceRequest)
TransactionRouter.get("/admin", AdminAuthorize, GetAllTransactions)
TransactionRouter.get('/total', AdminAuthorize, GetTotalMoney)

export default TransactionRouter;