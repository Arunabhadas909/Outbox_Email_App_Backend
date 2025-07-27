import express from 'express';
import { emailStore } from '../models/emailStore';
import { osClient } from '../lib/openSearchClient';
import { searchEmailsBySubject } from '../services/searchEmails';
    import { sendSlackNotification } from '../slack/notifySlack';
import { triggerWebhook } from '../webhook/webhook';

import { categorizeEmail } from '../controllers/categorizeEmail';
import { connectToIMAP,emailsFetched } from '../services/imapService';
import { Email } from '../interfaces/interface';

import { openai, index } from "../emailSuggestion/config";
const router = express.Router();

// router.get('/sync', (req,res) => {

    router.get('/sync', async (req, res) => {
  try {
    const emails = await emailsFetched;
    res.json(
emails

    );
  } catch (err) {
    console.error('Failed to fetch emails:', err);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// });


router.post('/categorize', async (req, res) => {
  const { subject, email_body } = req.body;

  if (!subject || !email_body) {
    return res.status(400).json({ error: 'Missing subject or email_body' });
  }

  try {
    const category = await categorizeEmail(subject, email_body);



// After categorization:
if (category === 'Interested') {
  await sendSlackNotification(subject, email_body);
  await triggerWebhook(subject, email_body);
}

    res.json({ category });


// console.log('OpenAI key starts with:', process.env.OPENAI_API_KEY?.slice(0, 5));









  } catch (err) {


    // console.log('OpenAI key starts with:', process.env.OPENAI_API_KEY?.slice(0, 5));

    console.error('Error categorizing:', err);

    // console.error('Error categorizing:', err?.response?.data || err?.message || err);

    res.status(500).json({ error: 'Failed to categorize email' });
  }
});



router.post('/login',(req,res)=>{


  const { email, password } = req.body;

   console.log('Raw body:', req.body);

  if (!email || !password) {

    console.log(email);
    console.log(password);
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    // Simulated auth (replace with real IMAP logic if needed)
    console.log(`Logging in with: ${process.env.IMAP_USER} / ${process.env.IMAP_PASS}`);

    // TODO: Use real validation, e.g., connect via IMAP and check creds

    // Mock login success
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Login failed', error });
  }
});




router.get('/emails', (req, res) => {
  res.json(emailStore);
});

router.get('/search', async (req, res)=>{
  const term = req.query.q || 'invoice';

  // const result = await osClient.search({
  //   index: 'emails',
  //   body: {
  //     query: {
  //       match: { subject: term }
  //     }
  //   }
  // });


  const emails = searchEmailsBySubject('invoice');


  res.json(emails);
});




router.post("/suggest-reply", async (req, res) => {
  try {
    const { emailText } = req.body;

    // Step 1: Embed incoming email
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: emailText,
    });

    const queryVector = embedding.data[0].embedding;

    // Step 2: Query Pinecone for similar instructions
    const queryResult = await index.query({
      vector: queryVector,
      topK: 1,
      includeMetadata: true,
    });

    const contextPrompt = queryResult.matches?.[0]?.metadata?.prompt ?? "";

    // Step 3: Build a final prompt
    const finalPrompt = `
You are helping a job seeker reply to an email.
Based on this instruction: "${contextPrompt}", generate a polite, professional reply to this email:

"${emailText}"
    `;

    // Step 4: Ask GPT-3.5 for a suggested reply
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: finalPrompt }],
    });

    const reply = completion.choices[0].message?.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});











export default router;