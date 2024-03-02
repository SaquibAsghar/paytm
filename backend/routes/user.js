const {Router} = require("express");
const router = Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config");

const { User, Account } = require("../db");
const authMiddleware = require("../middlewares/auth.middleware.js");
const { validateMiddleware } = require("../middlewares/validate.middleware.js");

const signupBody = zod.object({
  userName: zod.string().email(),
  firstName: zod.string().min(2, "First Name should be of minimum length 2"),
  lastName: zod.string().min(2, "Last Name should be of minimum length 2"),
  password: zod.string().min(6, "Password should be of minimum length 6"),
});

const signinBody = zod.object({
  userName: zod.string().email(),
  password: zod.string().min(6, "Password should be of minimum length 6"),
});

const updateUserBody = zod.object({
  firstName: zod
    .string()
    .min(2, "First Name should be of minimum length 2")
    .optional(),
  lastName: zod
    .string()
    .min(2, "Last Name should be of minimum length 2")
    .optional(),
  password: zod
    .string()
    .min(6, "Password should be of minimum length 6")
    .optional(),
});

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { success, error, data } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        route: "signup",
        success,
        error,
      });
    }
    const existingUser = await User.findOne({
      userName: req.body.userName,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken",
        success: false,
      });
    }
    const userCreated = await User.create({
      userName: req.body.userName,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    const userId = userCreated._id;

    const accountDBResponse = await Account.create({
      userId,
      balance: parseInt(1 + Math.random() * 10000),
    });
    console.log(accountDBResponse)
    if (!accountDBResponse) {
      throw new Error('Account balance creation failed');
    }
    const token = jwt.sign(
      {
        userId,
      },
      jwtSecretKey
    );

    res.json({
      message: "User created successfully",
      token: token,
      userCreated,
    });
  } catch (error) {
    console.log("[ERROR]:", error.message);
    res.status(500).json({
      message: "Operation failed",
      success: false,
    });
  }
});

router.post("/signin", authMiddleware, async (req, res) => {
  const { success, error, data } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      success,
      error,
    });
  }
  const existingUser = await User.findById(req.userId);

  console.log(existingUser);

  if (!existingUser) {
    return res.status(404).json({
      message: "Error while logging",
      success: false,
    });
  }

  if (existingUser) {
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      jwtSecretKey
    );

    return res.status(200).json({
      token: token,
      success: true,
    });
  }

  console.log("Im hit");
  res.status(200).json({
    msg: "Success",
    route: "signin",
  });
});

router.put(
  "/",
  (req, res, next) => {
    const { success, error, data } = updateUserBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        msg: "Error while updating information",
        success,
        error,
      });
    }
    next();
  },
  authMiddleware,
  async (req, res) => {
    const { userId, body } = req;
    console.log(userId, body);
    const existingUser = await User.findById({ _id: userId });
    // console.log(existingUser)
    if (!existingUser) {
      res.status(404).json({
        msg: "User not found",
        success: false,
      });
    }
    const updatedUser = await User.updateOne(
      {
        _id: userId,
      },
      req.body
    );
    if (!updatedUser) {
      return res.status(404).json({
        msg: "Update operation failed",
        status: false,
        route: "update",
      });
    }
    return res.status(200).json({
      msg: "Updated successfully",
      success: true,
    });
  }
);

router.get(
  "/bulk",
  (req, res, next) => {
    const { success, error, data } = updateUserBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        msg: "Error while updating information",
        success,
        error,
      });
    }
    next();
  },
  async (req, res) => {
    console.log(req.query);
    const filter = req.query.filter || "";
    const userList = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    console.log("List=>", userList);
    res.status(200).json({
      msg: "Success",
      route: "bulk",
      success: true,
    });
  }
);

module.exports = {
  userRouter: router,
};
