import { Router } from "express";
import { GetUsers, DelUser, PatchUser,GetUser } from "../controllers/user.controller.js";
import AdminAuthorize from "../middleware/admin.middleware.js";

const UserRouter = Router();

//get all users
UserRouter.get("/",AdminAuthorize, GetUsers);

//delete user
UserRouter.delete("/:id",AdminAuthorize, DelUser )

//get agent
UserRouter.get("/:id", AdminAuthorize, GetUser)

//patch user status
UserRouter.patch("/:id", AdminAuthorize, PatchUser)



export default UserRouter;
