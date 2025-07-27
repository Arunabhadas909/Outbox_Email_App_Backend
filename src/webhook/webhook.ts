// utils/triggerWebhook.ts
import axios from 'axios';

const WEBHOOK_URL = process.env.WEBHOOK_SITE_URL!; // get from https://webhook.site

export async function triggerWebhook(subject: string, sender: string) {
  try {
    await axios.post(WEBHOOK_URL, {
      event: 'interested_email',
      data: {
        subject,
        sender,
      },
    });
  } catch (err) {
    console.error('Webhook trigger failed:', err);
  }
}
