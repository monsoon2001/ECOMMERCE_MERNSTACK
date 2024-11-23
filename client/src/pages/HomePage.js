import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { Carousel } from 'react-bootstrap';

const MyCarousel = () => {
  return (
    <Carousel interval={3000} pause={false}>
      <Carousel.Item>
        <img className="d-block w-100" src="/images/gym1.jpg" alt="First slide" />
        <Carousel.Caption>
        <h3>Welcome to Muscle Mart</h3>
        <p>Discover a wide range of fitness equipment and accessories.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src="/images/gym2.jpg" alt="Second slide" />
        <Carousel.Caption>
        <h3>Get Fit, Stay Healthy</h3>
        <p>Our high-quality products are designed to help you achieve your fitness goals.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src="/images/gym3.jpg" alt="Third slide" />
        <Carousel.Caption>
        <h3>Shop with Confidence</h3>
        <p>Experience excellent customer service and fast delivery with Muscle Mart.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};



const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    
          // Add new item to the cart
      const addToCart = (product) => {
        const existingItem = cart.find((item) => item._id === product._id);
    
        if (existingItem) {
          // If item already exists, increase the quantity
          increaseQuantity(product._id);
          toast.success('Item added to cart');
        } else {
          // If item doesn't exist, add it to the cart with quantity 1
          const newItem = { ...product, quantity: 1 };
          const updatedCart = [...cart, newItem];
          setCart(updatedCart);
          localStorage.setItem("cart", JSON.stringify(updatedCart));
          toast.success('Item added to cart');
        }
      };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  


  return (
    <Layout title={"Muscle Mart"}>
      <MyCarousel />
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  onClick={() => navigate(`/product/${p.slug}`)}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("ne-NP", {
                        style: "currency",
                        currency: "NPR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    {/* <button
                      className="btn btn-outline-primary"
                      onClick={() => addToCart(p)}
                    >
                      ADD TO CART
                    </button> */}
                    <button
                      className={`btn ${
                        p.quantity <= 0 ? 'btn-outline-danger' : 'btn-outline-primary'
                      }`}
                      onClick={() => addToCart(p)}
                      disabled={p.quantity <= 0}
                    >
                      {p.quantity <= 0 ? 'Out of Stock' : 'ADD TO CART'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
