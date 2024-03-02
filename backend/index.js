require('dotenv').config()
const express = require("express");
const { apiRouter } = require("./routes");
const cors = require("cors");
const connectToMongoDB = require("./utils/connectDB.mongo");
const app = express();

try {
  const PORT = process.env.PORT || 8000;
  connectToMongoDB(`${process.env.MONGOO_DB_URL}/${process.env.DB_NAME}`)
  .then(() => {
      app.use(cors());
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());
    
      app.use("/api/v1", apiRouter);
    
      app.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
      });
  })
} catch (error) {
  console.log("Error connecting", error.message);
}
