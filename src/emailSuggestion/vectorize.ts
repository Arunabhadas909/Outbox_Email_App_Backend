// // src/vectorize.ts
// import { openai, index } from "./config";

// interface TrainingData {
//   category: string;
//   prompt: string;
// }

// export async function vectorizeAndUpsert(data: TrainingData[]) {
//   for (const item of data) {
//     const embedding = await openai.embeddings.create({
//       model: "text-embedding-3-small",
//       input: item.prompt,
//     });

//     await index.upsert([
//       {
//         id: item.category,
//         values: embedding.data[0].embedding,
//         metadata: { prompt: item.prompt },
//       },
//     ]);
//   }
// }



// embedding + chat logic using Groq


import axios from "axios";
import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
dotenv.config();

const pinecone = new Pinecone();
const index = pinecone.Index("your-index-name");

const GROQ_API_URL = "https://api.groq.com/openai/v1";
const HEADERS = {
  Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  "Content-Type": "application/json",
};
