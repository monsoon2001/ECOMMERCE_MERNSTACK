import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About Us - Ecommerce App"}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h2 className="mb-4">Our Story</h2>
            <p className="text-justify">
              Welcome to our Ecommerce App, where we bring you the latest in
              fitness gear, accessories, and much more. Our journey began with a
              passion for helping people live healthier lives by providing
              top-quality fitness products.
            </p>
            <p className="text-justify">
              With years of experience and a commitment to excellence, we have
              grown into a trusted online destination for fitness enthusiasts.
              We believe in the power of fitness to transform lives and are
              dedicated to helping you achieve your health and wellness goals.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="/images/about.jpeg"
              alt="About Us"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <h2>Our Mission</h2>
            <p className="text-justify">
              Our mission is to provide you with the best fitness products that
              support your journey to a healthier, more active lifestyle. We
              strive to offer a wide range of high-quality items that cater to
              various fitness preferences and goals.
            </p>
          </div>
          <div className="col-md-6">
            <h2>Why Choose Us?</h2>
            <p className="text-justify">
              At Ecommerce App, we stand out for our commitment to customer
              satisfaction. We offer:
            </p>
            <ul>
              <li>Top-quality products from trusted brands</li>
              <li>Exceptional customer service</li>
              <li>Fast and secure delivery</li>
              <li>A wide selection of fitness equipment</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
