// utils/notifySlack.ts
import { WebClient } from '@slack/web-api';

const slackToken = process.env.SLACK_BOT_TOKEN!;
const slackChannel = process.env.SLACK_CHANNEL!;

const slackClient = new WebClient(slackToken);

export async function sendSlackNotification(subject: string, sender: string) {
  try {
    await slackClient.chat.postMessage({
      channel: slackChannel,
      text: `📧 *New Interested Email!*\n\n*From:* ${sender}\n*Subject:* ${subject}`,
    });
  } catch (err) {
    console.error('Slack notification failed:', err);
  }
}
