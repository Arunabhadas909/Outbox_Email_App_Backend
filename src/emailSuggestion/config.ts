// src/config.ts
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Pinecone now uses a base URL instead of environment
export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);
