import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Suppress the deprecation warning
mongoose.set("strictQuery", false);

const connectDB = async () => {
  // mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  // .then(() => {
  //     console.log("Connected to database...");
  // }).catch((error) => {
  //     console.log(error);
  // });
  mongoose
    .connect(
      "mongodb+srv://mernstack:mernstack123@mernstack.kdi49mo.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
      console.log("Connected to database...");
    })
    .catch((error) => {
      console.log(error);
    });
};

export default connectDB;
