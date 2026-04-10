import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Sparkles, ArrowRight } from 'lucide-react';
import { parseBankSMS, ParsedSMS } from '@/utils/smsParser';

interface SMSParserProps {
  onParsed: (data: ParsedSMS) => void;
}

export default function SMSParser({ onParsed }: SMSParserProps) {
  const [sms, setSms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsed, setParsed] = useState<ParsedSMS | null>(null);

  const sampleSMS = [
    'UPI-Debited Rs.500.00 to MERCHANT at 01/01/24. Avl Bal: Rs.10,000.00',
    'Your A/c XX1234 is debited for Rs.2500.00 at AMAZON on 15-12-2023',
    'Rs.1000 credited to your account from friend via UPI',
    'ICICI Debit Card XX5678 Rs.350 spent at SWIGGY on 20/11/23',
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = parseBankSMS(sms);
      setParsed(result);
      onParsed(result);
      setIsAnalyzing(false);
    }, 1000);
  };

  const loadSample = (sample: string) => {
    setSms(sample);
    const result = parseBankSMS(sample);
    setParsed(result);
    onParsed(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary-400 mb-2">
        <Smartphone className="w-5 h-5" />
        <span className="font-medium">Paste Bank SMS</span>
      </div>

      <div className="relative">
        <textarea
          value={sms}
          onChange={(e) => {
            setSms(e.target.value);
            setParsed(null);
          }}
          placeholder="Paste your bank SMS here..."
          className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <motion.button
          onClick={handleAnalyze}
          disabled={!sms || isAnalyzing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Extract Data
            </>
          )}
        </motion.button>
      </div>

      {parsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
        >
          <div className="flex items-center gap-2 text-green-400 mb-3">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Extracted Data</span>
          </div>
          
          <div className="space-y-2">
            {parsed.amount && (
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-medium text-green-400">₹{parsed.amount}</span>
              </div>
            )}
            {parsed.merchant && (
              <div className="flex justify-between">
                <span className="text-slate-400">Merchant:</span>
                <span className="font-medium">{parsed.merchant}</span>
              </div>
            )}
            {parsed.type && (
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className={parsed.type === 'credit' ? 'text-green-400' : 'text-red-400'}>
                  {parsed.type === 'credit' ? 'Credit' : 'Debit'}
                </span>
              </div>
            )}
            {parsed.cardLast4 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Card:</span>
                <span className="font-medium">****{parsed.cardLast4}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="pt-2">
        <p className="text-xs text-slate-500 mb-2">Try with sample SMS:</p>
        <div className="flex flex-wrap gap-2">
          {sampleSMS.map((sample, i) => (
            <button
              key={i}
              onClick={() => loadSample(sample)}
              className="text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white truncate max-w-[200px]"
            >
              {sample.substring(0, 25)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
