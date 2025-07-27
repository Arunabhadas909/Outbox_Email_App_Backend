// src/searchEmails.ts

import { Client } from '@opensearch-project/opensearch';

const client = new Client({
  node: 'https://q9cqvzgdnv:ckr1500rxq@abcd-services-india-2691055956.us-east-1.bonsaisearch.net'
});

export async function searchEmailsBySubject(term: string) {
  const result = await client.search({
    index: 'emails',
    body: {
      query: {
        match: {
          subject: term
        }
      }
    }
  });

  return result.body.hits.hits.map(hit => hit._source);
}
