import { Router } from "express";
import { GetAgents , DelAgent, PatchAgent, GetAgent } from "../controllers/user.controller.js";
import AdminAuthorize from "../middleware/admin.middleware.js";

const AgentRouter = Router();

//get all agents
AgentRouter.get("/",AdminAuthorize, GetAgents);

//get agent
AgentRouter.get("/:id", AdminAuthorize, GetAgent)

//delete agent
AgentRouter.delete("/:id",AdminAuthorize, DelAgent);

//patch agent status
AgentRouter.patch("/:id",AdminAuthorize, PatchAgent);


export default AgentRouter;
