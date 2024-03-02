const zod = require("zod");
const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { Account, User } = require("../db");

const router = Router();

const checkTransferBody = zod.object({
  to: zod.string().email(),
  amount: zod
    .number()
    .positive()
    .min(1, "Minimum amount to transfer is 1")
    .max(10000, "Maximum amount to transfer is 10000"),
});

const validateTransferBody = (req, res, next) => {
  const { success, error, data } = checkTransferBody.safeParse(req.body);
  if (!success)
    return res.status(411).json({
      message: "Not a valid transfer",
      error,
      success: false,
    });
  next();
};

// ---- GET: user balance
router.get("/balance", authMiddleware, async (req, res) => {
  try {
    console.clear();
    console.log("req.userId: ", req.userId);
    const { userId } = req;
    const accountDBResponse = await Account.findOne({
      userId,
    });
    console.log(accountDBResponse);
    if (!accountDBResponse) throw new Error("No account found with given user");
    return res.status(200).json({
      balance: accountDBResponse.balance,
      success: true,
    });
  } catch (error) {
    console.log("[ERROR]:", error.message);
    return res.status(404).json({
      message: error.message,
      success: false,
    });
  }
});

// ---- POST: send user money
router.post(
  "/transfer",
  validateTransferBody,
  authMiddleware,
  async (req, res) => {
    try {
      const { to, amount } = req.body;
      const { userId } = req;
      console.log({ userId });
      const getSenderDetail = await User.findById({
        _id: userId,
      });
      const getReceiverDetail = await User.findOne({
        userName: to,
      });
      console.log(getSenderDetail.id);
      if (!getSenderDetail) throw new Error("Sender does not exist");
      if (!getReceiverDetail) throw new Error("Receiver does not exist");
      const getSenderBalance = await Account.findOne({
        userId: getSenderDetail._id,
      });

      console.log(getSenderBalance);

      if (getSenderBalance.balance < amount)
        throw new Error(`You have insufficient amount`);

      const getReceiverBalance = await Account.findOne({
        userId: getReceiverDetail._id,
      });
      console.log(getReceiverBalance);
      if (!getReceiverBalance) throw new Error(`User ${to} does not exist`);

      const receiverUserId = getReceiverBalance.userId;

      //   This call is sender's account balance
      const senderUpdatedBalance = await Account.findOneAndUpdate(
        {
          userId,
        },
        {
          $inc: {
            balance: -amount,
          },
        }
      );

      console.log("senderUpdatedBalance =>", senderUpdatedBalance);

      //   This call is receiver's account balance

      const receiveUpdatedBalance = await Account.findOneAndUpdate(
        {
          userId: receiverUserId,
        },
        {
          $inc: {
            balance: amount,
          },
        }
      );
      console.log("receiveUpdatedBalance => ", receiveUpdatedBalance);
      res.status(200).json({
        message: "Transaction successfully received",
        success: true,
      });
    } catch (error) {
      console.log("[ERROR]:", error.message);
      res.status(400).json({
        message: error.message,
        success: false,
      });
    }
  }
);

module.exports = {
  accountRouter: router,
};
