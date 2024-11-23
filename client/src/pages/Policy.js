import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img
              src="/images/contactus.jpeg"
              alt="Privacy Policy"
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-md-6">
            <h1>Privacy Policy</h1>
            <p>
              At Ecommerce App, we are committed to protecting your privacy and
              safeguarding your personal information. This Privacy Policy
              explains how we collect, use, and protect your data when you use
              our website and services.
            </p>
            <h2>Information We Collect</h2>
            <p>
              We may collect personal information, such as your name, email
              address, and contact details, when you interact with our website,
              make purchases, or contact our customer support team.
            </p>
            <h2>How We Use Your Information</h2>
            <p>
              We use your information to provide and improve our services,
              process orders, and communicate with you. We do not share your
              personal information with third parties without your consent,
              except as required by law.
            </p>
            <h2>Security Measures</h2>
            <p>
              We take security seriously and have implemented measures to
              protect your data. We use secure connections (SSL) to encrypt
              sensitive information and regularly update our security protocols.
            </p>
            <h2>Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or for legal reasons. We encourage you to
              review this policy periodically to stay informed.
            </p>
            <p>
              For more details about our Privacy Policy, or if you have any
              questions or concerns, please contact us at
              <a href="mailto:privacy@ecommerceapp.com"> privacy@ecommerceapp.com</a>.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
