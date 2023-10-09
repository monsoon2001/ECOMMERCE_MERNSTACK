import React from 'react';
import Layout from "./../components/Layout/Layout";
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <Layout>
        <div className="container" style={{marginTop: "120px"}}>
            <div className="alert alert-success" role="alert">
                <h2>Payment Successful!</h2>
                <p>Your payment has been successfully processed.</p>
            </div>

            <Link to="/" className="btn btn-primary mt-3">
                Continue Shopping
            </Link>
        </div>
    </Layout>
  );
};

export default SuccessPage;
