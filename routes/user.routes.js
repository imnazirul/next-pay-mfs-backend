import { Router } from "express";
import { GetUsers, DelUser, PatchUser,GetUser, GetLoggedInUser } from "../controllers/user.controller.js";
import AdminAuthorize from "../middleware/admin.middleware.js";
import Authorize from "../middleware/auth.middleware.js";

const UserRouter = Router();

//get all users
UserRouter.get("/",AdminAuthorize, GetUsers);

//me api
UserRouter.get("/me",Authorize, GetLoggedInUser);

//delete user
UserRouter.delete("/:id",AdminAuthorize, DelUser )

//get agent
UserRouter.get("/:id", AdminAuthorize, GetUser)

//patch user status
UserRouter.patch("/:id", AdminAuthorize, PatchUser)



export default UserRouter;
