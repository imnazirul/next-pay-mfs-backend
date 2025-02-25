import User from "../models/user.model.js";

//agent controllers
//get agents
const GetAgents = async (req, res, next) => {
  try {
    const { mobile } = req.query; // Get mobile from query parameters
    let query = { kind: "AGENT" };
    if (mobile) {
      query.mobile = { $regex: mobile, $options: "i" }; // Case-insensitive search
    }
    const Users = await User.find(query).lean();
    res
      .status(200)
      .json({ success: true, message: "All Agents For Admin", data: Users });
  } catch (error) {
    next(error);
  }
};

//delete agent
const DelAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteAgent = await User.findOneAndDelete({ _id: id, kind: "AGENT" });
    if (!deleteAgent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent Not Found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Agent Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

// patch agent
const PatchAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const agent = await User.findOneAndUpdate(
      { _id: id, kind: "AGENT" },
      { status: status },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Agent Updated Successfully",
      data: agent,
    });
  } catch (error) {
    next(error);
  }
};

//user controllers
const GetUsers = async (req, res, next) => {
  try {
    const { mobile } = req.query; // Get mobile from query parameters
    let query = { kind: "USER" };
    if (mobile) {
      query.mobile = { $regex: mobile, $options: "i" }; // Case-insensitive search
    }
    const Users = await User.find(query).lean();
    res
      .status(200)
      .json({ success: true, message: "All Users For Admin", data: Users });
  } catch (error) {
    next(error);
  }
};

const PatchUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: id, kind: "USER" },
      { status: status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Agent Updated Successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const DelUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findOneAndDelete({ _id: id, kind: "USER" });
    if (!deleteUser) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export { GetAgents, GetUsers, DelUser, DelAgent, PatchAgent, PatchUser };
