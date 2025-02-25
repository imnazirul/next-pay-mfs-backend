import { Router } from "express";
import { GetAgents, GetUsers, DelUser, DelAgent, PatchAgent, PatchUser } from "../controllers/user.controller.js";
import AdminAuthorize from "../middleware/admin.middleware.js";

const UserRouter = Router();


//----------------user routes------------>
//get all users
UserRouter.get("/",AdminAuthorize, GetUsers);

//delete user
UserRouter.delete("/:id",AdminAuthorize, DelUser )

//patch user status
UserRouter.patch("/:id", AdminAuthorize, PatchUser)


//----------agent routes ------------------>
//get all agents
UserRouter.get("/agents",AdminAuthorize, GetAgents);

//delete agent
UserRouter.delete("/agents/:id",AdminAuthorize, DelAgent);

//patch agent status
UserRouter.patch("/agents/:id",AdminAuthorize, PatchAgent);


export default UserRouter;
