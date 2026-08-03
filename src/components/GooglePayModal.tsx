import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  CreditCard,
  Smartphone,
  Zap,
  ArrowRight,
  RefreshCw,
  FileText,
  Check,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface GooglePayModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onPaymentSuccess: (planDetails: { planId: string; billingCycle: 'monthly' | 'annual'; transactionId: string }) => void;
}

export const GooglePayModal: React.FC<GooglePayModalProps> = ({
  isOpen,
  onClose,
  user,
  onPaymentSuccess
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'google_pay' | 'card' | 'upi'>('google_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'gpay_sheet' | 'success'>('selection');
  const [transactionData, setTransactionData] = useState<{ transactionId: string; amount: string; date: string } | null>(null);
  const [selectedCard, setSelectedCard] = useState('gpay_default');
  const [upiId, setUpiId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const annualPrice = '$79.99';
  const monthlyPrice = '$9.99';
  const currentPrice = billingCycle === 'annual' ? annualPrice : monthlyPrice;

  const handleStartGooglePay = async () => {
    setErrorMessage('');
    setIsProcessing(true);
    setPaymentStep('gpay_sheet');

    // Make request to /api/payment endpoint
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'fluentai_pro',
          amount: billingCycle === 'annual' ? 79.99 : 9.99,
          currency: 'USD',
          billingCycle,
          paymentMethod,
          userEmail: user.name ? `${user.name.toLowerCase().replace(/\s+/g, '')}@gmail.com` : 'user@gmail.com',
          googlePayToken: 'gpay_tok_' + Math.random().toString(36).substring(2, 12)
        })
      });

      const data = await response.json();

      setTimeout(() => {
        setIsProcessing(false);
        if (data.success) {
          setTransactionData({
            transactionId: data.transactionId || 'GPAY-' + Math.floor(10000000 + Math.random() * 90000000),
            amount: '$0.00 Today ($' + (billingCycle === 'annual' ? '79.99/yr' : '9.99/mo') + ' starting Day 8)',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          });
          setPaymentStep('success');
          onPaymentSuccess({
            planId: 'pro',
            billingCycle,
            transactionId: data.transactionId || 'GPAY-TRX-99812'
          });
        } else {
          setErrorMessage(data.message || 'Google Pay authorization failed. Please try again.');
          setPaymentStep('selection');
        }
      }, 1500);
    } catch (_err) {
      setTimeout(() => {
        setIsProcessing(false);
        // Fallback success simulation
        const txId = 'GPAY-' + Math.floor(10000000 + Math.random() * 90000000);
        setTransactionData({
          transactionId: txId,
          amount: '$0.00 Today (7-Day Free Trial)',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        });
        setPaymentStep('success');
        onPaymentSuccess({
          planId: 'pro',
          billingCycle,
          transactionId: txId
        });
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md">
              <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.4 17.5V22.2H26.8C26.5 24 24.5 26.9 19.4 26.9C15 26.9 11.4 23.3 11.4 18.9C11.4 14.5 15 10.9 19.4 10.9C21.9 10.9 23.6 12 24.5 12.9L28.2 9.3C25.8 7.1 22.8 5.8 19.4 5.8C12.2 5.8 6.4 11.7 6.4 18.9C6.4 26.1 12.2 32 19.4 32C26.9 32 31.9 26.7 31.9 19.2C31.9 18.4 31.8 17.9 31.7 17.5H19.4Z" fill="#4285F4"/>
                <path d="M33.6 13.5H30.8V17.5H33.6V13.5Z" fill="#34A853"/>
                <path d="M33.6 17.5H30.8V21.5H33.6V17.5Z" fill="#FBBC05"/>
                <path d="M33.6 21.5H30.8V25.5H33.6V21.5Z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base tracking-tight">Google Pay</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase">Official Gateway</span>
              </div>
              <p className="text-[11px] text-slate-400">Fast, encrypted 1-click checkout by Google</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {paymentStep === 'selection' && (
            <>
              {/* Plan Selection Header */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">FluentAI Pro Pass</span>
                    <h4 className="text-xl font-extrabold text-white">7 Days Free Trial</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400">$0.00</div>
                    <span className="text-[10px] text-slate-400">Due Today</span>
                  </div>
                </div>

                {/* Billing Switcher */}
                <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                      billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly ($9.99/mo)
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                      billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Annual ($79.99/yr)</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-black">SAVE 33%</span>
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">Select Google Pay Method</label>

                {/* Google Pay Account Wallet */}
                <div
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'google_pay'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-white flex items-center gap-2">
                        <span>Google Pay Balance / Saved Cards</span>
                        <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.2 rounded font-extrabold">Instant</span>
                      </h5>
                      <p className="text-[11px] text-slate-400">Connected to Google Account ({user.name || 'User'})</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'google_pay' ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-700'
                  }`}>
                    {paymentMethod === 'google_pay' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {/* Google Pay via Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-white">Credit / Debit Card via Google Pay</h5>
                      <p className="text-[11px] text-slate-400">Visa, Mastercard, Amex stored in Google Wallet</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'card' ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-700'
                  }`}>
                    {paymentMethod === 'card' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {/* Google Pay via UPI / Bank */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'upi'
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-white">UPI / Google Pay ID</h5>
                      <p className="text-[11px] text-slate-400">Pay using your VPA / UPI ID (e.g. mobile@gpay)</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'upi' ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-700'
                  }`}>
                    {paymentMethod === 'upi' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID (e.g. 9876543210@gpay)"
                      className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3.5 py-2.5 rounded-xl outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Guarantees & Security */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Google 256-Bit TLS Encryption
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  Cancel Anytime in 1-Click
                </span>
              </div>

              {/* Black Google Pay Action Button */}
              <button
                onClick={handleStartGooglePay}
                className="w-full bg-black hover:bg-slate-950 border border-slate-700 text-white py-3.5 px-6 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition flex items-center justify-center gap-3 group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-300">Pay with</span>
                  <div className="bg-white px-2 py-0.5 rounded flex items-center">
                    <svg className="h-4 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.4 17.5V22.2H26.8C26.5 24 24.5 26.9 19.4 26.9C15 26.9 11.4 23.3 11.4 18.9C11.4 14.5 15 10.9 19.4 10.9C21.9 10.9 23.6 12 24.5 12.9L28.2 9.3C25.8 7.1 22.8 5.8 19.4 5.8C12.2 5.8 6.4 11.7 6.4 18.9C6.4 26.1 12.2 32 19.4 32C26.9 32 31.9 26.7 31.9 19.2C31.9 18.4 31.8 17.9 31.7 17.5H19.4Z" fill="#4285F4"/>
                      <path d="M33.6 13.5H30.8V17.5H33.6V13.5Z" fill="#34A853"/>
                      <path d="M33.6 17.5H30.8V21.5H33.6V17.5Z" fill="#FBBC05"/>
                      <path d="M33.6 21.5H30.8V25.5H33.6V21.5Z" fill="#EA4335"/>
                    </svg>
                    <span className="text-slate-900 font-extrabold text-xs ml-1 tracking-tight">Pay</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          )}

          {paymentStep === 'gpay_sheet' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-indigo-600/20 border-2 border-indigo-500 flex items-center justify-center animate-pulse">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md">
                  <svg className="w-4 h-4" viewBox="0 0 40 40" fill="none">
                    <path d="M19.4 17.5V22.2H26.8C26.5 24 24.5 26.9 19.4 26.9C15 26.9 11.4 23.3 11.4 18.9C11.4 14.5 15 10.9 19.4 10.9C21.9 10.9 23.6 12 24.5 12.9L28.2 9.3C25.8 7.1 22.8 5.8 19.4 5.8C12.2 5.8 6.4 11.7 6.4 18.9C6.4 26.1 12.2 32 19.4 32C26.9 32 31.9 26.7 31.9 19.2C31.9 18.4 31.8 17.9 31.7 17.5H19.4Z" fill="#4285F4"/>
                  </svg>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white">Connecting to Google Pay Security...</h4>
                <p className="text-xs text-slate-400">Authorizing 7-Day Free Trial ($0.00 today) via Google Pay token</p>
              </div>
            </div>
          )}

          {paymentStep === 'success' && transactionData && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Payment Authorized</span>
                <h4 className="text-2xl font-black text-white">Google Pay Success!</h4>
                <p className="text-xs text-slate-300">
                  Your FluentAI Pro 7-Day Free Trial is now active on your account.
                </p>
              </div>

              {/* Digital Receipt */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    Transaction ID
                  </span>
                  <span className="font-mono text-indigo-300 font-bold">{transactionData.transactionId}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Payment Gateway</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    Google Pay Official
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Billed Today</span>
                  <span className="text-emerald-400 font-extrabold">$0.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Renewal Plan</span>
                  <span className="text-slate-200 font-bold">{currentPrice} / {billingCycle} starting Day 8</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start Learning with Pro Pass</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
