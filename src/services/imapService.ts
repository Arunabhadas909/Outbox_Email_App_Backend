import Imap from 'node-imap';
import { simpleParser, ParsedMail } from 'mailparser';
import dotenv from 'dotenv';
import { emailStore } from '../models/emailStore';

import { Readable } from 'stream';

import { indexEmailToOpenSearch } from './indexEmail';

import { searchEmailsBySubject } from './searchEmails';
import {Email} from '../interfaces/interface'
dotenv.config();




const imapConfig = {
  user: process.env.IMAP_USER!,
  password: process.env.IMAP_PASS!,
  host: process.env.IMAP_HOST!,
  port: Number(process.env.IMAP_PORT!),
  tls: true
};



export let emailsFetched: Email[] = [];

    
  

export function connectToIMAP() {
  const imap = new Imap(imapConfig);



  imap.once('ready', () => {
    imap.openBox('INBOX', false, () => {
      console.log('IMAP connection ready, inbox opened');

      imap.on('mail', () => {

        console.log("fetching emails");
        fetchLatestEmails(imap);
      });
    });
  });

  imap.once('error', (err) => console.error('IMAP Error:', err));
  imap.connect();
}


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}





function fetchLatestEmails(imap: Imap) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 30);

  imap.search(['ALL', ['SINCE', sinceDate.toDateString()]], (err, results) => {
    if (err || !results.length) return;

    const f = imap.fetch(results.slice(-10), { bodies: '' });
      
    f.on('message', (msg) => {
      msg.on('body', async (stream: NodeJS.ReadableStream) => {
        try {
          const parsed: ParsedMail = await simpleParser(stream as Readable);
          console.log('📥 Email:', parsed.subject, parsed.from?.text);



             const emailData = {
      subject: parsed.subject,
      from: parsed.from?.text,
    to: Array.isArray(parsed.to)
  ? parsed.to.map((a: any) => a.name || a.address).join(', ')
  : parsed.to?.value.map((v: any) => v.name || v.address).join(', ') || '',
      date: parsed.date,
      text: parsed.text,
      html: parsed.html
    };

     emailStore.push(emailData);
emailsFetched.push(emailData);
    //  emailsFetched.push(emailData);

            await indexEmailToOpenSearch(emailData);

            await sleep(500);


          

        } catch (err) {
          console.error('Parse error:', err);
        }
      });
    });

    f.once('end', () => {
      console.log('✅ Finished fetching emails.');
    });
  });
}
