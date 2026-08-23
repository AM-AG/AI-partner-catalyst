
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Theme, User } from '@/types/types';
import { PRICING_PLANS, handleBuyCredits, VITE_FRONTEND_URL } from '@/services/parameters';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

type PricingProps = {
  theme: Theme;
  user: User | "";
};

type PricingPlan = {
  id: string;
  name: string;
  credits: number;
  price: string;
  bonusPercent: number;
  recommended: boolean;
  description: string;
  product_id: string;
  currency: string;
  active: boolean;
  payment_type: string;
};

type PricingCardProps = {
  plan: PricingPlan;
  isDark: boolean;
  User: User | "";
};

const PricingCard = ({ plan, isDark, User }: PricingCardProps) => {
    const accentColor = isDark ? 'text-[#66FCF1]' : 'text-[#007AFF]';
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const cardClassName = [
        'relative flex flex-col gap-6 rounded-3xl border p-3 shadow-xl',
        'transition-all duration-300 hover:scale-[1.05]',
        plan.recommended ? 'scale-[1.03]' : 'hover:-translate-y-1',
        isDark
        ? plan.recommended
        ? 'border-[#66FCF1]/40 bg-gradient-to-b from-[#0B0C10] to-[#1F2833] shadow-[0_0_40px_rgba(102,252,241,0.15)]'
        : 'border-white/10 bg-[#0B0C10]'
        : plan.recommended
        ? 'border-[#007AFF]/40 bg-white'
        : 'border-gray-200 bg-white',
        ].join(' ');

    const buttonClassName = [
        'mt-auto w-full rounded-xl py-3',
        'text-[11px] font-bold uppercase tracking-widest',
        'transition-all active:scale-95',
        plan.recommended
        ? isDark
        ? 'bg-[#66FCF1] text-black hover:bg-[#45A29E]'
        : 'bg-[#007AFF] text-white hover:bg-[#005FCC]'
        : isDark
        ? 'bg-white/10 hover:bg-white/20'
        : 'bg-gray-100 hover:bg-gray-200',
        ].join(' ');

    const handleBuy = async () => {
        setLoading(true);

        if (!User) {
          navigate('/Login');
          return;
        }

        try {

          await handleBuyCredits(plan.product_id, User, plan.payment_type,
            `${VITE_FRONTEND_URL}/dashboard/User/${User.user_id}/checkout/success`,
            `${VITE_FRONTEND_URL}/dashboard/User/${User.user_id}/checkout/cancelled`,
            quantity
          );
        } catch (error) {
          console.error('Failed to start checkout:', error);
        } finally {
          setLoading(false);
        }
      };

    return ( 
    <article className={cardClassName}>
        {plan.recommended && (
        <span
        className={[
        'absolute -top-3 left-1/2 -translate-x-1/2',
        'rounded-full px-4 py-1',
        'text-[9px] font-mono uppercase tracking-widest',
        isDark ? 'bg-[#66FCF1] text-black' : 'bg-[#007AFF] text-white',
        ].join(' ')}
        >
        Most Popular </span>
        )}


      <div className="space-y-2 text-center">
        <div
          className={`text-[11px] font-mono uppercase tracking-widest ${accentColor}`}
        >
          {plan.name}
        </div>

        <div className="text-4xl font-black tracking-tight">
          {(plan.credits * quantity).toLocaleString('fr-FR')}
        </div>

        <div className="text-[11px] uppercase opacity-50">
          Credits
        </div>
      </div>

      <div className="space-y-1 text-center">
        <div className="text-2xl font-bold">
          {`${Number(plan.price) * quantity} $`}
        </div>

        {plan.bonusPercent > 0 && (
          <div
            className={`text-[11px] font-mono ${
              plan.recommended ? accentColor : 'opacity-50'
            }`}
          >
            +{plan.bonusPercent}% Bonus
          </div>
        )}
      </div>

      <ul className="mt-3 mb-6 flex-1 space-y-2.5">
        {plan.description
          .match(/'([^']*)'/g)
          ?.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-[11px] text-gray-400">
              <svg
                className="h-3 w-3 shrink-0 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="truncate">
                {feature.replace(/^'|'$/g, "").trim()}
              </span>
            </li>
          ))}
      </ul>
      
      {/* Letting Users choosing the quantity */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20"
        >
          −
        </button>

        <span className="min-w-[40px] text-center text-sm font-bold">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(40, q + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20"
        >
          +
        </button>
      </div>

      <button type="submit" 
      onClick={handleBuy} 
      disabled={loading}
      className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#66FCF1] px-5 py-4 text-sm font-black text-[#0B0C10] shadow-lg shadow-[#66FCF1]/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-[#66FCF1]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B0C10]/30 border-t-[#0B0C10]"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              Buy {plan.name}
            </>
          )}
      </button>
    </article>

);
};

export const Pricing = ({ theme, user }: PricingProps) => {
    let params = useParams();
    const userid  = params?.userid;
    const isDark = theme === 'dark';

    const plans = Array.isArray(PRICING_PLANS)
      ? (PRICING_PLANS as PricingPlan[])
      : [];

    return ( 
      <div className="space-y-8 overflow-y-auto">
      {/* userid is undefined for /Pricing */}
      {/* userid contains the value for /User/:userid/Pricing */}
      {userid && ( <div className="px-6 text-xs font-mono opacity-50">
      User ID: {userid} </div>
      )}

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isDark={isDark}
              User={user} 
            />
          ))}
        </div>

        <div
          className={[
            'rounded-xl border px-5 py-4',
            'text-[10px] font-mono leading-relaxed',
            isDark
              ? 'border-white/10 bg-white/5 text-white/50'
              : 'border-gray-200 bg-gray-50 text-gray-500',
          ].join(' ')}
        >
          Credits are consumed by audio synthesis, grounding queries, and asset
          generation. All purchases are final.
        </div>
      </div>
);
};
