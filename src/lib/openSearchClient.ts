// // // import 'dotenv/config';


// // // import { Client } from '@elastic/elasticsearch';

// // // export const esClient = new Client({
// // //   node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
// // // });


// // // src/services/elasticsearch.ts (or .js)

// // import { Client } from '@elastic/elasticsearch';

// // export const client = new Client({
// //   node: 'http://localhost:9200',
// //   maxRetries: 3,
// //   requestTimeout: 60000,
// //   sniffOnStart: true,
// //   ssl: { rejectUnauthorized: false }, // Use only if SSL with self-signed cert
// //   auth: {
// //     username: 'elastic',
// //     password: 'your-password' // replace with your actual ES password
// //   }
// // });




// import { Client } from '@elastic/elasticsearch';

// export const client = new Client({
//   node: 'http://localhost:9200',
//   maxRetries: 3,
//   requestTimeout: 60000,
//   sniffOnStart: true,
//   // auth: {
//   //   username: 'arunabhadas909@gmail.com',
//   //   password: 'your-password' // Replace with your actual password
//   // }
// });

























import { Client } from '@opensearch-project/opensearch';

// export const osClient = new Client({
//   node: process.env.OPENSEARCH_URL || 'https://q9cqvzgdnv:ckr1500rxq@abcd-services-india-2691055956.us-east-1.bonsaisearch.net:443',
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });
export const osClient = new Client({
  node: 'https://q9cqvzgdnv:ckr1500rxq@abcd-services-india-2691055956.us-east-1.bonsaisearch.net'
});


osClient.ping({}, { requestTimeout: 1000 }, function (error) {
  if (error) {
    console.error('❌ OpenSearch cluster is down!');
  } else {
    console.log('✅ OpenSearch is reachable.');
  }
});
