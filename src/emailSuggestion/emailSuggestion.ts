// src/suggestReply.ts
import express from "express";
import { openai, index } from "./config";
import axios from "axios";

const router = express.Router();

// router.post("/suggest-reply", async (req, res) => {
//   try {
//     const { emailText } = req.body;

//     // Step 1: Embed incoming email
//     const embedding = await openai.embeddings.create({
//       model: "text-embedding-3-small",
//       input: emailText,
//     });

//     const queryVector = embedding.data[0].embedding;

//     // Step 2: Query Pinecone for similar instructions
//     const queryResult = await index.query({
//       vector: queryVector,
//       topK: 1,
//       includeMetadata: true,
//     });

//     const contextPrompt = queryResult.matches?.[0]?.metadata?.prompt ?? "";

//     // Step 3: Build a final prompt
//     const finalPrompt = `
// You are helping a job seeker reply to an email.
// Based on this instruction: "${contextPrompt}", generate a polite, professional reply to this email:

// "${emailText}"
//     `;

//     // Step 4: Ask GPT-3.5 for a suggested reply
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: finalPrompt }],
//     });

//     const reply = completion.choices[0].message?.content;
//     res.json({ reply });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to generate reply" });
//   }
// });





router.post("/suggest-reply", async (req, res) => {
  const { emailText } = req.body;

  // Assume you've already stored the embedding in Pinecone using some method
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small", // use fallback if needed
    input: emailText,
  });

  const queryVector = embedding.data[0].embedding;

  const queryResult = await index.query({
    topK: 1,
    vector: queryVector,
    includeMetadata: true,
  });

  const contextPrompt = queryResult.matches?.[0]?.metadata?.prompt ?? "";

  const finalPrompt = `
You are helping a job seeker reply to an email. Based on this instruction: "${contextPrompt}", generate a polite, professional reply to this email:

"${emailText}"
  `;

  


  const HEADERS = {
  Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  "Content-Type": "application/json",
};






  const completionRes = await axios.post(
    `${process.env.GROQ_API_URL}/chat/completions`,
    {
      model: "mixtral-8x7b-32768", // or llama3-8b-8192
      messages: [{ role: "user", content: finalPrompt }],
    },
    { headers: HEADERS }
  );

  const suggestedReply = completionRes.data.choices[0].message.content;
  res.json({ reply: suggestedReply });
});

export default router;
