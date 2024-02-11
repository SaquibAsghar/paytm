const express = require("express");
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config");

const { User } = require("../db.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const {validateMiddleware, middleware2, middleware3} = require("../middlewares/validate.middleware.js");

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
  firstName: zod.string().min(2, "First Name should be of minimum length 2").optional(),
  lastName: zod.string().min(2, "Last Name should be of minimum length 2").optional(),
  password: zod.string().min(6, "Password should be of minimum length 6").optional(),
});

router.post("/signup", async (req, res) => {
  console.log(`Body, ${req.body}`);
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
});

/*  
router.post("/signin", validateMiddleware(signinBody), authMiddleware, async (req, res) => {
  console.log(
    "\n",
    "Directory : ",
    __dirname,
    "\n",
    "FileName: ",
    __filename,
    "\n"
  );
  // const { success, error, data } = signinBody.safeParse(req.body);
  // if (!success) {
  //   return res.status(411).json({
  //     success,
  //     error,
  //   });
  // }
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

router.put("/", validateMiddleware(updateUserBody), authMiddleware, async (req, res) => {
  res.status(200).json({
    msg: 'Updated successfully',
    success: true,
  })
});
*/
router.get('/', validateMiddleware(updateUserBody), middleware2, middleware3)

module.exports = {
  userRouter: router,
};
