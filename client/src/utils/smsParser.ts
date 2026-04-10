export interface ParsedSMS {
  amount: number | null;
  merchant: string | null;
  type: 'debit' | 'credit' | null;
  date: string | null;
  cardLast4?: string;
}

export function parseBankSMS(sms: string): ParsedSMS {
  const result: ParsedSMS = {
    amount: null,
    merchant: null,
    type: null,
    date: null,
  };

  const upperSMS = sms.toUpperCase();
  const lowerSMS = sms.toLowerCase();

  const amountPatterns = [
    /rs\.?\s*([\d,]+(?:\.\d{2})?)/i,
    /inr\s*([\d,]+(?:\.\d{2})?)/i,
    /₹\s*([\d,]+(?:\.\d{2})?)/i,
    /([\d,]+(?:\.\d{2})?)\s*(?:rs|inr)/i,
    /debited[:\s]*([\d,]+(?:\.\d{2})?)/i,
    /credited[:\s]*([\d,]+(?:\.\d{2})?)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = sms.match(pattern);
    if (match) {
      result.amount = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }

  if (upperSMS.includes('DEBITED') || upperSMS.includes('DEBIT') || upperSMS.includes('SPENT')) {
    result.type = 'debit';
  } else if (upperSMS.includes('CREDITED') || upperSMS.includes('CREDIT') || upperSMS.includes('RECEIVED')) {
    result.type = 'credit';
  }

  const merchantPatterns = [
    /(?:to|at|on)\s+([A-Za-z\s]+?)(?:\s+on|\s+for|\s+rs|\s+\d{2}\/\d{2}|$)/i,
    /(?:merchant|purchase|paid)\s+(?:at|to)?\s*([A-Za-z\s]+?)(?:\s+on|\s+for|$)/i,
  ];

  for (const pattern of merchantPatterns) {
    const match = sms.match(pattern);
    if (match && match[1]) {
      result.merchant = match[1].trim().replace(/\s+/g, ' ');
      break;
    }
  }

  const datePatterns = [
    /(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/,
    /(\d{4}[\/\-]\d{2}[\/\-]\d{2})/,
    /(\d{2}\s+\w+\s+\d{4})/i,
  ];

  for (const pattern of datePatterns) {
    const match = sms.match(pattern);
    if (match) {
      result.date = match[1];
      break;
    }
  }

  const cardMatch = sms.match(/x{4}(\d{4})/i) || sms.match(/(?:card|cc)\s*(?:.*?)(?:ending\s*)?(\d{4})/i);
  if (cardMatch) {
    result.cardLast4 = cardMatch[1];
  }

  return result;
}
