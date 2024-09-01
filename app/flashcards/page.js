"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { writeBatch } from "firebase/firestore";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import {
  Card,
  Container,
  Grid,
  CardActionArea,
  Typography,
  CardContent,
} from "@mui/material";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];

        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }
  const handleCardClick = (id) => {
    router.push(`/flashcards?id=${id}`);
  };

  return (
    <Container maxWidth="100vw">
      <Grid
        container
        spacing={3}
        sx={{
          mt: 4,
        }}
      >
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
