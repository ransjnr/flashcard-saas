"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import getStripe from "@/utils/get-stripe";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Container, CircularProgress } from "@mui/material";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!sessionId) return;
      try {
        const res = await fetch(
          `/api/checkout-session?session_id=${sessionId}`
        );
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData);
        }
      } catch (err) {
        console.log(err);
        setError("An error occured");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }),
    [sessionId];

  if (loading) {
    return (
      <Container
        maxWidth="100vw"
        sx={{
          TextAlign: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }
  if (error) {
    return (
      <Container
        maxWidth="100vw"
        sx={{
          TextAlign: "center",
          mt: 4,
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Container>
    );
  }
  return (
    <Container
      maxWidth="100vw"
      sx={{
        TextAlign: "center",
        mt: 4,
      }}
    >
      {session.payment_status === "paid" ? (
        <>
          <Typography variant="h6">Payment successful</Typography>
          <Typography variant="h6">Thank you for your purchase</Typography>
          <Box sx={{ mt: 22 }}>
            <Typography variant="h6">Order ID: {session.id}</Typography>
            <Typography variant="h6">Amount: {session.amount}</Typography>
            <Typography variant="h6">
              Payment status: {session.payment_status}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h6">Payment failed</Typography>
          <Typography variant="h6">Thank you for your purchase</Typography>
          <Box sx={{ mt: 22 }}>
            <Typography variant="body1">
              Your payment was not successful, please try again
            </Typography>
          </Box>
        </>
      )}
    </Container>
  );
};

export default ResultPage;
