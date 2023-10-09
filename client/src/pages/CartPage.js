import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price * item.quantity;
      });
      return total.toLocaleString("ne-NP", {
        style: "currency",
        currency: "NPR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Increase quantity of a product in the cart
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Decrease quantity of a product in the cart
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);



  const khaltiPayment = async () => {
    try {
      setLoading(true);
      const totalAmount = cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      const paymentData = {
        return_url: "http://localhost:3000/success",
        website_url: "http://localhost:3000",
        amount: totalAmount * 100, // Amount should be in paisa
        purchase_order_id: "your_order_id", // Replace with a unique order ID
        purchase_order_name: "Your Order Name",
        customer_info: {
          name: "Monsoon Parajuli",
          email: "monsoon@gmail.com",
          phone: "9811496763",
        },
        amount_breakdown: [
          {
            label: "Total Price",
            amount: totalAmount * 100, // Same as the total amount
          },
        ],
        product_details: cart.map((item) => ({
          identity: item._id,
          name: item.name,
          total_price: item.price * item.quantity * 100, // Total price per item in paisa
          quantity: item.quantity,
          unit_price: item.price * 100, // Unit price per item in paisa
        })),
      };
      
      const response = await axios.post("/api/initiate-payment", paymentData);
      const khaltiUrl = response.data;
      if(khaltiUrl) {
        window.open(khaltiUrl, '_blank');
      }else {
        console.error("Payment URL not fount in response");
      }

      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.error("Error initiating payment:", error);
      setLoading(false);
    }
  };

    //handle payments
    // const handlePayment = async () => {
    //   try {
    //     setLoading(true);
    //     const { nonce } = await instance.requestPaymentMethod();
    //     const { data } = await axios.post("/api/v1/product/braintree/payment", {
    //       nonce,
    //       cart,
    //     });
    //     setLoading(false);

    //     for (const item of cart) {
    //       // Make an API request to update the product quantity
    //       // await axios.put(`/api/v1/product/updateQuantity/${item._id}`, {
    //       //   itemQuantity: item.quantity,
    //       // });
    //       const itemQuantity = item.quantity;
    //       fetch(`/api/v1/product/updateQuantity/${item._id}`, {
    //         method: 'PUT',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({itemQuantity}), // Send only the new quantity as a number
    //       })
    //     }
        
    //     localStorage.removeItem("cart");
    //     setCart([]);
    //     navigate("/dashboard/user/orders");
    //     toast.success("Payment Completed Successfully ");
    //   } catch (error) {
    //     console.log(error);
    //     setLoading(false);
    //   }
    // };

    //handle payments
const handlePayment = async () => {
  try {
    setLoading(true);
    // Check if the quantities in the cart exceed the available quantities in the database
    const insufficientQuantityItems = [];
    for (const item of cart) {
      const response = await fetch(`/api/v1/product/checkQuantity/${item._id}`);
      const { availableQuantity } = await response.json();
      console.log(availableQuantity);
      if (item.quantity > availableQuantity) {
        insufficientQuantityItems.push(item.name); // Add the item name to the list
      }
    }

    console.log(insufficientQuantityItems.length);

    if (insufficientQuantityItems.length > 0) {
      // Display an error toast and stop payment if any item has insufficient quantity
      toast.error(
        `Sorry, the following items are out of stock or have insufficient quantity: ${insufficientQuantityItems.join(
          ", "
        )}`
      );
    } else {
    const { nonce } = await instance.requestPaymentMethod();
    const productQuantities = [];

    for (const item of cart) {
      productQuantities.push({
        productId: item._id,
        quantity: item.quantity,
      });
    }

    const paymentData = {
      nonce,
      cart,
      productQuantities, // Include the product quantities in the request
    };

    const { data } = await axios.post(
      "/api/v1/product/braintree/payment",
      paymentData
    );

    // After processing the payment, update the product quantities
    for (const quantityData of productQuantities) {
      const { productId, quantity } = quantityData;

      const response = await fetch(`/api/v1/product/updateQuantity/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemQuantity: quantity }), // Send the new quantity as a number
      });

      if (!response.ok) {
        // Handle errors if necessary
        console.error(`Error updating quantity for product ID ${productId}`);
      }
    }

    setLoading(false);
    localStorage.removeItem("cart");
    setCart([]);
    navigate("/dashboard/user/orders");
    toast.success("Payment Completed Successfully ");
  }
  } catch (error) {
    console.error("Error processing payment:", error);
    setLoading(false);
  }
};


  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
          <div className="col-md-7">
          {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="90%"
                      height={"140px"}
                    />
                  </div>
                  <div className="col">
                    <p>{p.name}</p>
                    {/* <p>{p.description.substring(0, 30)}</p> */}
                    <p>Price : {p.price}</p>
                  </div>
                  <div className="col cart-remove-btn">
                  <div>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => decreaseQuantity(p._id)}
                      >
                        -
                      </button>&nbsp;&nbsp;
                      <span>{p.quantity}</span>&nbsp;&nbsp;
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => increaseQuantity(p._id)}
                      >
                        +
                    </button>
                    </div>
                    <div>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeCartItem(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <div>
                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button> 
                    </div>

                    <div style={{marginTop: "10px"}}>
                    <button
                      className="btn btn-info"
                      onClick={khaltiPayment}
                      disabled={loading || !instance || !auth?.user?.address}
                      style={{marginBottom: "10px"}}
                    >
                      {loading ? "Processing ...." : "Pay with Khalti"}
                    </button>
                    </div>
                    
          
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;