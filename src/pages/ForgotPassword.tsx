import { FormEvent, useState } from 'react';
import { Theme } from '@/types/types';
import { VITE_API_BASE_URL } from '@/services/parameters';

type ForgotPasswordProps = {
  theme: Theme;
};

const FORGOT_PASSWORD_ENDPOINT = `${VITE_API_BASE_URL}/api/auth/password/reset`;

export const ForgotPassword = ({ theme }: ForgotPasswordProps) => {
  const isDark = theme;

  const t = (dark: string, light: string) =>
    isDark ? dark : light;

  const cardTheme = isDark
    ? 'border-white/10 bg-white/5'
    : 'border-black/10 bg-white/70';

  const mutedText = isDark
    ? 'text-[#C5C6C7]/70'
    : 'text-[#1F2833]/70';

  const headingText = isDark
    ? 'text-white'
    : 'text-[#1F2833]';

  const accentText = isDark
    ? 'text-[#66FCF1]'
    : 'text-[#007AFF]';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setSuccess(false);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(FORGOT_PASSWORD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      let data: { message?: string } = {};

      try {
        data = await response.json();
      } catch {
        // Backend returned no JSON body.
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          'We could not process your request. Please try again.'
        );
      }

      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`
        mx-auto flex min-h-[70vh] w-full max-w-5xl
        items-center justify-center
        px-6 py-12 sm:py-20
        ${headingText}
      `}
    >
      <section className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <p
            className={`
              mb-4 text-sm font-black uppercase
              tracking-[0.3em] ${accentText}
            `}
          >
            Account Recovery
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Forgot your password?
          </h1>

          <p
            className={`
              mx-auto mt-5 max-w-md text-base leading-7
              ${mutedText}
            `}
          >
            Enter the email address associated with your account.
            If an account exists, we'll send you instructions to
            create a new password.
          </p>

        </div>


        {/* Card */}
        <div
          className={`
            rounded-[2rem] border p-7 shadow-2xl
            sm:p-10 ${cardTheme}
          `}
        >

          {success ? (

            /* Success */
            <div className="text-center">

              <div
                className={`
                  mx-auto flex h-16 w-16 items-center justify-center
                  rounded-full text-2xl
                  ${t(
                    'bg-[#66FCF1]/10 text-[#66FCF1]',
                    'bg-[#007AFF]/10 text-[#007AFF]'
                  )}
                `}
              >
                ✓
              </div>

              <h2 className="mt-6 text-2xl font-black">
                Check your inbox
              </h2>

              <p className={`mt-3 leading-7 ${mutedText}`}>
                If an account is associated with that email address,
                you will receive password reset instructions shortly.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setError('');
                }}
                className={`
                  mt-8 font-bold underline underline-offset-4
                  ${accentText}
                `}
              >
                Try another email
              </button>

            </div>

          ) : (

            /* Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="forgot-password-email" className="mb-2 block text-sm font-bold" >
                  Email address
                </label>

                <input id="forgot-password-email" name="email" type="email" autoComplete="email" autoFocus
                  required value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@example.com"
                  disabled={loading}
                  className={` w-full rounded-2xl border px-5 py-4 outline-none transition placeholder:opacity-40
                    focus:ring-2
                    ${t('border-white/10 bg-black/30 focus:border-[#66FCF1]/50 focus:ring-[#66FCF1]/10',
                      'border-black/10 bg-white focus:border-[#007AFF]/50 focus:ring-[#007AFF]/10'
                    )}`}/>
              </div>

              {/* Error */}
              {error && (
                <div role="alert" className={`rounded-2xl border px-4 py-3 text-sm leading-6
                    ${t('border-red-400/20 bg-red-400/10 text-red-300',
                      'border-red-500/20 bg-red-50 text-red-600')}`}>
                  {error}
                </div>
              )}


              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className={` w-full rounded-2xl px-6 py-4 font-black uppercase tracking-[0.15em]
                  shadow-xl transition disabled:cursor-not-allowed disabled:opacity-40
                  ${t('bg-[#66FCF1] text-black hover:brightness-110',
                    'bg-[#007AFF] text-white hover:brightness-110')}`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className={`
                        h-4 w-4 animate-spin rounded-full border-2
                        border-transparent ${t('border-t-black', 'border-t-white')}`}/>
                    Sending...
                  </span>
                ) : (
                  'Send reset link'
                )}
              </button>

            </form>
          )}

        </div>


        {/* Security note */}
        <p className={`mx-auto mt-6 max-w-md text-center text-xs leading-6 ${mutedText}`}>
          For security reasons, we don't reveal whether an email
          address is registered. If you don't receive an email,
          check your spam folder or try again later.
        </p>

      </section>
    </main>
  );
};