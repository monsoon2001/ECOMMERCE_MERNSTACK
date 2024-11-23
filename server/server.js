import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";

import axios from "axios";

import Product from "./models/productModel.js";


// echo "# mern_stack" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/monsoon2001/mern_stack.git
// git push -u origin main

//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.get("/name", (req, res) => {
  res.send("This is the root route.");
});




// app.post("/api/initiate-payment", async (req, res) => {
//   try {
//     // Extract the payment payload data from the request body
//     const paymentData = req.body;

//     // Make a request to Khalti's API to initiate the payment
//     const khaltiResponse = await request.post({
//       url: "https://a.khalti.com/api/v2/epayment/initiate/",
//       headers: {
//         Authorization: "key b885cd9d8dc04eebb59e6f12190ae017", // Replace with your Khalti API key
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(paymentData),
//     });

//     // Parse the Khalti API response and send it back to the client
//     const khaltiData = JSON.parse(khaltiResponse);
//     res.json(khaltiData);
//   } catch (error) {
//     console.error("Error initiating Khalti payment:", error);
//     res.status(500).json({ message: "Payment initiation failed" });
//   }
//   // const paymentData = req.body;
//   // console.log(JSON.stringify(paymentData));
// });

// Endpoint to check available quantity of a product
app.get("/api/v1/product/checkQuantity/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(product.name);

    res.json({ availableQuantity: product.quantity });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  console.log(productId);

  // Find the product by productId (you might use a database query here)
  // const product = Product.find((p) => p._id === productId);

  // if(!product) {
  //   return res.status(404).json({ message: "Product not found" });
  // }

  // res.json({ availableQuantity: product.quantity });
  
});

// API endpoint for updating product quantity
app.put('/api/v1/product/updateQuantity/:productId', async (req, res) => {
  const productId = req.params.productId;
  const itemQuantity = req.body.itemQuantity;
  console.log(productId, itemQuantity);

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the quantity of the product
    const newQuantity = product.quantity - itemQuantity;
    product.quantity = newQuantity;

    // Save the updated product
    await product.save();

    return res.status(200).json({ message: 'Product quantity updated successfully' });
  } catch (error) {
    console.error('Error updating product quantity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.post("/api/initiate-payment", async (req, res) => {
  try {
    // Extract the payment payload data from the request body
    const payload = req.body;

    // Make a request to Khalti's API to initiate the payment using axios
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/", 
      payload, 
      {
        headers: {
          Authorization: `Key b885cd9d8dc04eebb59e6f12190ae017`, 
        },
      }
    );

    // Parse the Khalti API response and send it back to the client
    const khaltiData = khaltiResponse.data;
    console.log(JSON.stringify(khaltiData.payment_url));
    const khaltiPaymentUrl = khaltiData.payment_url;
    // res.json({paymentUrl: khaltiPaymentUrl});
    res.send(khaltiPaymentUrl);

  } catch (error) {
    console.error("Error initiating Khalti payment:", error);
    res.status(500).json({ message: "Payment initiation failed" });
  }
});


//PORT
const PORT = process.env.PORT || 5000;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
