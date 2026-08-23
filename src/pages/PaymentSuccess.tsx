import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DarkLight, VITE_API_BASE_URL } from '@/services/parameters';
import { db } from '@/store/db';
import { Theme } from '@/types/types';
import { useAuth } from '@/hooks/useAuth';

export const PaymentSuccess = ({ theme }: { theme: Theme }) => {
  const isDark = DarkLight(theme);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();

  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'checking' | 'success' | 'error' >('checking');

  const t = (dark: string, light: string) =>
    isDark ? dark : light;

  const cardTheme = isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white/70';
  const mutedText = isDark ? 'text-[#C5C6C7]/70' : 'text-[#1F2833]/70';
  const headingText = isDark ? 'text-white' : 'text-[#1F2833]';
  const accentText = isDark ? 'text-[#66FCF1]' : 'text-[#007AFF]';

  const { user, setUser, refreshUser } = useAuth();

  useEffect(() => {
      if (!sessionId) {
        setStatus('error');
        return;
      }

      const controller = new AbortController();
      let cancelled = false;
      const sleep = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

      const verifyPayment = async () => {
        const maxAttempts = 12;
        const pollInterval = 5000;

        try {
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const response = await fetch(
              `${VITE_API_BASE_URL}/api/payment/verify?session_id=${encodeURIComponent(sessionId)}`,
              {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                },
                signal: controller.signal,
              }
            );

            if (!response.ok) {
              throw new Error(
                `Payment verification failed: ${response.status}`
              );
            }

            const data = await response.json();

            if (cancelled) return;

            if (data.paid === true) {
              setStatus('success');
              return;
            }

            if (data.status === 'failed') {
              setStatus('error');
              return;
            }

            // Payment is still pending.
            if (attempt < maxAttempts - 1) {
              await sleep(pollInterval);
            }
          }

          // Still pending after all attempts.
          if (!cancelled) {
            setStatus('error');
          }
        } catch (error) {
          // Abort is expected when the component unmounts or sessionId changes.
          if (error instanceof Error && error.name === 'AbortError') {
            return;
          }

          console.error('Payment verification error:', error);

          if (!cancelled) {
            setStatus('error');
          }
        }
      };

      verifyPayment();

      return () => {
        cancelled = true;
        controller.abort();
      };
    }, [sessionId]);


  return (
    <div className={`flex flex-col h-full overflow-y-auto relative p-4 overflow-hidden transition-colors ${
        isDark ? 'bg-[#0B0C10] text-[#C5C6C7]' : 'bg-[#F8F9FA] text-[#1F2833]'
      }`}
    >
      <section className="w-full max-w-xl text-center">
        {/* Status icon */}
        <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border
            ${t('border-[#66FCF1]/20 bg-[#66FCF1]/10', 'border-[#007AFF]/20 bg-[#007AFF]/10')}`}>
          {status === 'checking' ? (
            <div className={`h-9 w-9 animate-spin rounded-full border-2
                border-transparent ${t('border-t-[#66FCF1]', 'border-t-[#007AFF]')}`}/>
          ) : status === 'success' ? (
            <svg className={`h-11 w-11 ${accentText}`} fill="none" viewBox="0 0 24 24" 
                stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          ) : (
            <svg className="h-11 w-11 text-red-500" fill="none" viewBox="0 0 24 24"  stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          )}
        </div>

        {/* Heading */}
        <p className={`mt-8 text-sm font-black uppercase tracking-[0.3em] ${accentText}`}>
          {status === 'checking' ? 'Verifying payment' : 
              status === 'success' ? 'Payment confirmed'
                  : 'Payment verification'}
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
          {status === 'checking' ? 'Just a moment.'
            : status === 'success' ? 'You’re all set.'
              : 'We could not confirm it.'}
        </h1>

        <p className={`mx-auto mt-5 max-w-md leading-7 ${mutedText}`}>
          {status === 'checking'
            ? 'We are securely checking your payment status. This should only take a moment.'
            : status === 'success'
              ? 'Your payment has been successfully confirmed. Your account can now use the purchased service or credits.'
              : 'We reached the checkout page, but we could not verify the payment. Your account has not been marked as paid.'}
        </p>

        {/* Card */}
        <div className={`mt-10 rounded-[2rem] border p-7 text-left shadow-2xl ${cardTheme}`}>
          {status === 'success' ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <span className={`text-sm ${mutedText}`}>
                  Payment status
                </span>

                <span className={`rounded-full px-3 py-1 text-xs font-black
                    ${t('bg-[#66FCF1]/10 text-[#66FCF1]', 'bg-[#007AFF]/10 text-[#007AFF]')}`}>
                  PAID
                </span>
              </div>

              <div className={t('border-white/10', 'border-black/10' ) + ' border-t pt-5'}>
                <p className={`text-xs ${mutedText}`}>
                  Checkout session
                </p>

                <p className="mt-1 break-all font-mono text-xs opacity-70">
                  {sessionId}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-bold">
                What happens next?
              </p>

              <p className={`text-sm leading-7 ${mutedText}`}>
                If you believe your payment was successful, please wait
                a moment and check your account again. You can also
                contact support with your payment details.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">

          <button onClick={async () => {
              await refreshUser();
              navigate(`/dashboard/User/${user ? user.user_id : ''}`)
              setUser(user);
            }
          }
            className={`rounded-full px-8 py-4 font-black uppercase tracking-[0.12em] 
              shadow-xl transition hover:scale-[1.02] 
              ${t('bg-[#66FCF1] text-black', 'bg-[#007AFF] text-white' )}`}>
            Go to dashboard
          </button>

          {status === 'error' && (
            <button onClick={() => window.location.reload()}
              className={`rounded-full border-2 px-8 py-4 font-black uppercase tracking-[0.12em]
                transition hover:opacity-70 ${t('border-white/20', 'border-black/15' )}`}>
              Check again
            </button>
          )}

        </div>
      </section>
    </div>
  );
};