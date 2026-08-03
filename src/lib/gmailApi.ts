export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  body: string;
}

export interface EmailLanguageAnalysis {
  cefrLevel: string;
  formalityScore: number; // 0-100
  keyVocabulary: { word: string; meaning: string; level: string }[];
  grammarTips: string[];
  suggestedReplies: {
    tone: 'Professional' | 'Casual' | 'Friendly';
    subject: string;
    body: string;
    explanation: string;
  }[];
}

/**
 * Base64Url encoder compliant with RFC 4648
 */
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Fetch list of recent Gmail messages
 */
export async function fetchGmailMessages(accessToken: string, query = '', maxResults = 10): Promise<GmailMessage[]> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (!data.messages || data.messages.length === 0) {
    return [];
  }

  // Fetch details for each message
  const detailPromises = data.messages.map(async (msg: { id: string }) => {
    const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!msgRes.ok) return null;
    const msgData = await msgRes.json();

    const headers = msgData.payload?.headers || [];
    const getHeader = (name: string) => headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    let bodyText = msgData.snippet || '';
    if (msgData.payload?.parts) {
      const textPart = msgData.payload.parts.find((p: { mimeType: string }) => p.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        try {
          bodyText = decodeURIComponent(escape(atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'))));
        } catch (e) {
          console.warn('Could not decode body:', e);
        }
      }
    }

    return {
      id: msgData.id,
      threadId: msgData.threadId,
      snippet: msgData.snippet || '',
      subject: getHeader('Subject') || '(No Subject)',
      from: getHeader('From') || 'Unknown Sender',
      date: getHeader('Date') ? new Date(getHeader('Date')).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
      body: bodyText
    };
  });

  const results = await Promise.all(detailPromises);
  return results.filter((m): m is GmailMessage => m !== null);
}

/**
 * Send an email via Gmail API
 */
export async function sendGmailEmail(accessToken: string, to: string, subject: string, body: string): Promise<string> {
  const emailContent = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\r\n');

  const raw = base64UrlEncode(emailContent);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to send email: ${err}`);
  }

  const result = await res.json();
  return result.id;
}

/**
 * Save draft email in Gmail
 */
export async function createGmailDraft(accessToken: string, to: string, subject: string, body: string): Promise<string> {
  const emailContent = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\r\n');

  const raw = base64UrlEncode(emailContent);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: { raw }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to save draft: ${err}`);
  }

  const result = await res.json();
  return result.id;
}
