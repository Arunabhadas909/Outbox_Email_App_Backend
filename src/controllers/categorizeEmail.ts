// // src/categorizeEmail.ts
// import  OpenAI  from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function categorizeEmail(subject: string, body: string): Promise<string> {
//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo', // Or use 'gpt-3.5-turbo' if you're on a free plan
//     messages: [
//       {
//         role: 'system',
//         content: `You are an email categorization assistant. Your job is to classify the email content into one of the following categories only:

// 1. Interested
// 2. Meeting Booked
// 3. Not Interested
// 4. Spam
// 5. Out of Office

// Always reply with just one of these exact phrases — nothing more.`
//       },
//       {
//         role: 'user',
//         content: `Subject: ${subject}\n\nBody: ${body}`
//       }
//     ],
//     temperature: 0.3 // Less randomness
//   });

//   const category = response.choices[0].message.content?.trim();
//   return category ?? 'Unknown';
// }




import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function categorizeEmail(subject: string, body: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are an email categorization assistant. Your job is to classify the email content into one of the following categories only:

1. Interested
2. Meeting Booked
3. Not Interested
4. Spam
5. Out of Office

Always reply with just one of these exact phrases — nothing more.`
          },
          {
            role: 'user',
            content: `Subject: ${subject}\n\nBody: ${body}`
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const category = response.data.choices[0].message.content.trim();
    return category;
  } catch (error : any ) {
    console.error('Groq API error:', error?.response?.data || error.message);
    throw new Error('Failed to categorize email');
  }
}
