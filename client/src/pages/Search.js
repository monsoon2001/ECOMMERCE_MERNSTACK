// import React from "react";
// import Layout from "./../components/Layout/Layout";
// import { useSearch } from "../context/search";
// const Search = () => {
//   const [values, setValues] = useSearch();
//   return (
//     <Layout title={"Search results"}>
//       <div className="container">
//         <div className="text-center">
//           <h1>Search Resuts</h1>
//           <h6>
//             {values?.results.length < 1
//               ? "No Products Found"
//               : `Found ${values?.results.length}`}
//           </h6>
//           <div className="d-flex flex-wrap mt-4">
//             {values?.results.map((p) => (
//               <div className="card m-2" style={{ width: "18rem" }}>
//                 <img
//                   src={`/api/v1/product/product-photo/${p._id}`}
//                   className="card-img-top"
//                   alt={p.name}
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{p.name}</h5>
//                   <p className="card-text">
//                     {p.description.substring(0, 30)}...
//                   </p>
//                   <p className="card-text"> $ {p.price}</p>
//                   <button class="btn btn-primary ms-1">More Details</button>
//                   <button class="btn btn-secondary ms-1">ADD TO CART</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Search;


// YO CHALNI WALA


import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
import { toast } from "react-hot-toast";

const Search = () => {
  const [cart, setCart] = useCart();
  const [values, setValues] = useSearch();

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
  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Resuts</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((p) => (
              <div className="card m-2" style={{ width: "18rem" }}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text"> NPR {p.price}</p>
                  <button class="btn btn-primary ms-1">More Details</button>
                  {/* <button class="btn btn-secondary ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem("cart", JSON.stringify([...cart, p]));
                      toast.success('Item added to cart');
                    }}
                  >ADD TO CART</button> */}
                  {/* <button
                    className="btn btn-outline-primary"
                    onClick={() => addToCart(p)
                    }
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
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;


// import React, { useEffect, useState } from "react";
// import Layout from "./../components/Layout/Layout";
// import { useSearch } from "../context/search";
// import { useCart } from "../context/cart";
// import { toast } from "react-hot-toast";

// const binarySearch = (sortedArray, target) => {
//   let left = 0;
//   let right = sortedArray.length - 1;

//   while (left <= right) {
//     const mid = Math.floor((left + right) / 2);
//     const currentItem = sortedArray[mid];

//     if (currentItem._id === target) {
//       return mid; // Product found, return its index
//     }

//     if (currentItem._id < target) {
//       left = mid + 1;
//     } else {
//       right = mid - 1;
//     }
//   }

//   return -1; // Product not found
// };

// const Search = () => {
//   const [cart, setCart] = useCart();
//   const [values, setValues] = useSearch();
//   const [searchResult, setSearchResult] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // Set your search term here

//   // Sort the results array based on a common key (e.g., product ID)
//   const sortedResults = values.results.sort((a, b) => a._id.localeCompare(b._id));

//   // Perform binary search when the component mounts
//   useEffect(() => {
//     const resultIndex = binarySearch(sortedResults, searchTerm);
//     console.log("Search Term:", searchTerm);
//     console.log("Sorted Results:", sortedResults);
//     console.log("Result Index:", resultIndex);

//     if (resultIndex !== -1) {
//       // Product found, set it in the searchResult state
//       const updatedSearchResult = [...searchResult];
//       updatedSearchResult.push(sortedResults[resultIndex]);
//       setSearchResult(updatedSearchResult);
//       console.log("Search Result Updated:", updatedSearchResult);
//     } else {
//       // Product not found, set an empty array
//       setSearchResult([]);
//       console.log("Search Result Updated: []"); // Empty array
//     }
//   }, [sortedResults, searchTerm]);

//   return (
//     <Layout title={"Search results"}>
//       <div className="container">
//         <div className="text-center">
//           <h1>Search Results</h1>
//           <h6>
//             {searchResult.length < 1
//               ? "No Products Found"
//               : `Found ${searchResult.length}`}
//           </h6>
//           <div className="d-flex flex-wrap mt-4">
//             {searchResult.map((p) => (
//               <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
//                 {/* Display product details here */}
//                 <img
//                   src={`/api/v1/product/product-photo/${p._id}`}
//                   className="card-img-top"
//                   alt={p.name}
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{p.name}</h5>
//                   <p className="card-text">
//                     {p.description.substring(0, 30)}...
//                   </p>
//                   <p className="card-text">NPR {p.price}</p>
//                   <button className="btn btn-primary ms-1">More Details</button>
//                   <button
//                     className="btn btn-secondary ms-1"
//                     onClick={() => {
//                       setCart([...cart, p]);
//                       localStorage.setItem("cart", JSON.stringify([...cart, p]));
//                       toast.success("Item added to cart");
//                     }}
//                   >
//                     ADD TO CART
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Search;


