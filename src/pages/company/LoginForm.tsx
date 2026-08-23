import { ArrowRight, Check, Chrome,  Eye, EyeOff, Github, Lock, Mail,Sparkles} from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {  db } from '@/store/db';

type LoginInputProps = {
  type: 'email' | 'password' | 'text';
  value: string;
  placeholder: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
};

function LoginInput({
  type,
  value,
  placeholder,
  onChange,
}: LoginInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      autoComplete={
        type === 'email'
          ? 'email'
          : 'current-password'
      }
      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/20 hover:border-white/20 focus:border-[#66FCF1]/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-[#66FCF1]/5"
    />
  );
}

export function LoginForm() {

  const { login, googleLogin, githublogin, setUser} = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {guest, error: loginError} = await login(email.trim(), password, isRegistering);
      if (guest) {
        navigate(`/dashboard/User/${guest.user_id}`);
        setUser(guest);
        return;
      }
      setError( loginError ?? 'Unable to authenticate. Please check your details.');

    } catch {
      setError('The server could not be reached. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = () => {
    setIsRegistering( (currentMode) => !currentMode );
    setError(null);
    setPassword('');
    setShowPassword(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'github' ) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (provider === 'google') {
        await googleLogin();
      } else {
        await githublogin();
      }

    } catch {
      setError(`Unable to continue with ${provider === 'google' ? 'Google' : 'GitHub'}. Please try again.`);
      setLoading(false);
    }
  };

  const title = isRegistering  ? 'Create your account' : 'Welcome back';

  const description = isRegistering
    ? 'Start building with Voxpact in just a few moments.' : 'Sign in to continue where you left off.';

  return (
    <section className="relative mx-auto w-full max-w-md">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[#66FCF1]/5 blur-[100px]"
        aria-hidden="true"
      />

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0C10]/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#66FCF1]/20 bg-[#66FCF1]/5">
            {isRegistering ? (
              <Sparkles size={21} className="text-[#66FCF1]" />
            ) : (
              <Check size={21} className="text-[#66FCF1]"/>
            )}
          </div>

          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#66FCF1]">
            {isRegistering ? 'Join Voxpact' : 'Voxpact account'}
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white">
            {title}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/45">
            {description}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div role="alert"
            className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email"
              className="block px-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/40"
            >
              Email address
            </label>

            <div className="relative">
              <Mail size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                aria-hidden="true"
              />

              <LoginInput
                type="email"
                value={email}
                placeholder="name@example.com"
                onChange={(event) => {
                  setEmail( event.target.value );
                  setError(null);
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="password"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40"
              >
                Password
              </label>

              {!isRegistering && (
                <button
                  type="button"
                  onClick={() => navigate('/password/reset')}
                  className="text-[10px] font-bold text-[#66FCF1]/70 transition-colors hover:text-[#66FCF1]"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <div className="relative">
              <Lock size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                aria-hidden="true"
              />

              <LoginInput
                type={ showPassword ? 'text' : 'password' }
                value={password}
                placeholder="Enter your password"
                onChange={(event) => { 
                  setPassword( event.target.value );
                  setError(null);
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword( (visible) => !visible) }
                aria-label={ showPassword ? 'Hide password' : 'Show password' }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-[#66FCF1]"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#66FCF1] px-5 py-4 text-sm font-black text-[#0B0C10] shadow-lg shadow-[#66FCF1]/10 transition-all duration-300 hover:scale-[1.01] hover:shadow-[#66FCF1]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B0C10]/30 border-t-[#0B0C10]"
                  aria-hidden="true"
                />

                {isRegistering ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              <>
                {isRegistering ? 'Create account' : 'Sign in'}

                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1"/>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7">
          <div className="border-t border-white/10" />

          <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[#0B0C10] px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
            Or continue with
          </span>
        </div>

        {/* Social authentication */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-semibold text-white/75 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Chrome size={18} />
            Google
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-semibold text-white/75 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Github size={18} />
            GitHub
          </button>
        </div>
      </div>

      {/* Sign-in / sign-up switch */}
      <p className="mt-7 text-center text-sm text-gray/10">
        {isRegistering
          ? 'Already have an account?'
          : "Don't have an account?"}

        <button
          type="button"
          onClick={handleModeChange}
          disabled={loading}
          className="ml-2 font-bold text-[#66FCF1] transition-colors hover:text-white disabled:opacity-50"
        >
          {isRegistering
            ? 'Sign in'
            : 'Sign up for free'}
        </button>
      </p>
    </section>
  );
}
