// import { client } from '../lib/elasticsearchClient';

// export async function indexEmailToElastic(email: any) {
//   try {
//     await client.index({
//       index: 'emails',
//       document: {
//         subject: email.subject,
//         from: email.from,
//         to: email.to,
//         date: email.date,
//         text: email.text,
//         html: email.html,
//         createdAt: new Date(),
//       }
//     });
//     console.log('📦 Email indexed into Elasticsearch');
//   } catch (err) {
//     console.error('Failed to index email:', err);
//   }
// }


// src/services/indexEmail.ts
import { osClient } from '../lib/openSearchClient';

export async function indexEmailToOpenSearch(email: any) {
  try {
    await osClient.index({
      index: 'emails',
      body: {
        subject: email.subject,
        from: email.from,
        to: email.to,
        date: email.date,
        text: email.text,
        html: email.html,
        createdAt: new Date(),
      }
    });
    console.log('📦 Email indexed into OpenSearch');
  }



//   try {
//   const result = await osClient.index({
//     index: 'emails',
//     body: {
//       from,
//       to,
//       subject,
//       text,
//       date: new Date().toISOString()
//     }
//   });
//   console.log('✅ Indexed email:', result);
// }
  
  catch (err) {
    console.error('❌ Failed to index email:', err);
  }
}
