import { Router } from "express";
import { getUser, getSingleUser, deleteUser, postUser, patchUser, putUser } from "../controllers/user.controller";

const UserRouter = Router();

/* GET users listing. */
UserRouter.get("/", getUser);

UserRouter.get("/:id", getSingleUser);

UserRouter.delete("/:id", deleteUser);

UserRouter.post("/", postUser);

UserRouter.patch("/:id", patchUser);

UserRouter.put("/:id", putUser);

export default UserRouter;
