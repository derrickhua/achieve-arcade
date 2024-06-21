// @ts-nocheck
'use client';
import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

const stripePromise = loadStripe('pk_test_51PTPCVP21qukNQhzLs4Av7FqTWdDVAZzQxAtaaZjQE7JnkbXjCteSbi5p7hHlmQIkE7I05SUM3NNdHFoaWsfPYE7002sQCXGAJ');

const CheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      getSessionStatus(sessionId)
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        })
        .catch((error) => {
          console.error('Error fetching session status:', error);
        });
    }

    if (urlParams.get('success')) {
      setMessage('Order placed! You will receive an email confirmation.');
    }

    if (urlParams.get('canceled')) {
      setMessage('Order canceled -- continue to shop around and checkout when you\'re ready.');
    }
  }, []);

  const fetchClientSecret = useCallback(async () => {
    try {
      console.log('Requesting client secret from backend');
      const clientSecret = await createCheckoutSession();
      console.log('Received client secret:', clientSecret);
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error fetching client secret:', error);
    }
  }, []);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  const options = { clientSecret };

  return (
    <div id="checkout" className="flex-1">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
