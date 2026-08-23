import { useNavigate, useParams } from 'react-router-dom';
import { DarkLight } from '../../services/parameters';
import { Theme } from '@/types/types';
import { useAuth } from '@/hooks/useAuth';

export const PaymentFailed = ({ theme }: { theme: Theme }) => {
  const isDark = DarkLight(theme);
  const navigate = useNavigate();
  const { user } = useAuth();

  const t = (dark: string, light: string) => isDark ? dark : light;

  const cardTheme = isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-white/70';

  const mutedText = isDark ? 'text-[#C5C6C7]/70' : 'text-[#1F2833]/70';

  const headingText = isDark ? 'text-white' : 'text-[#1F2833]';

  return (
    <div className={`flex flex-col h-full overflow-y-auto relative p-6 overflow-hidden 
      transition-colors text-center ${
        isDark ? 'bg-[#0B0C10] text-[#C5C6C7]' : 'bg-[#F8F9FA] text-[#1F2833]'
      }`}
    >
      <section className="w-full max-w-xl text-center">

        {/* Error icon */}
        <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border
            ${t('border-red-400/20 bg-red-400/10',  'border-red-500/20 bg-red-50')}`}>

          <svg className="h-11 w-11 text-red-500" fill="none" viewBox="0 0 24 24" 
            stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>

        {/* Heading */}
        <p className={`mt-8 text-sm font-black uppercase tracking-[0.3em] text-red-500`}>
          Checkout cancelled
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
          Payment not completed.
        </h1>

        <p className={`mx-auto mt-5 max-w-md leading-7 ${mutedText}`}>
          No payment was completed during this checkout session.
          Your account has not been charged for this transaction.
        </p>

        {/* Explanation */}
        <div className={`mt-10 rounded-[2rem] border p-7 text-left shadow-2xl ${cardTheme}`}>
          <h2 className="text-xl font-black">
            What would you like to do?
          </h2>

          <ul className={`mt-5 space-y-4 text-sm leading-7 ${mutedText}`}>
            <li className="flex gap-3">
              <span className="font-bold">01</span>
              <span>
                Return to checkout and try the payment again.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="font-bold">02</span>
              <span>
                Check that your payment method has sufficient funds
                and is supported.
              </span>
            </li>

            <li className="flex gap-3">
              <span className="font-bold">03</span>
              <span>
                If you were charged but the payment failed, contact
                support before attempting another payment.
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">

          <button
            onClick={() => navigate(`/dashboard/User/${user ? user.user_id : ''}/Account`)}
            className={`rounded-full px-8 py-4 font-black uppercase tracking-[0.12em] shadow-xl 
              transition hover:scale-[1.02] ${t('bg-[#66FCF1] text-black', 'bg-[#007AFF] text-white')}`}>
            Return to plans
          </button>

          <button onClick={() => navigate(`/dashboard/User/${user ? user.user_id : ''}`)}
            className={` rounded-full border-2 px-8 py-4 font-black uppercase tracking-[0.12em] 
              transition hover:opacity-70 ${t('border-white/20', 'border-black/15')}`}>
            Dashboard
          </button>

        </div>

        <p className={`mt-8 text-xs ${mutedText}`}>
          You can safely try again whenever you're ready.
        </p>

      </section>
    </div>
  );
};