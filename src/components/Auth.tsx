
import React, { useState } from 'react';
import { Mail, Lock, Github, Chrome, Zap } from 'lucide-react';
import { User } from '../../types/types';
import { DarkLight } from '../../services/parameters';

export const Auth: React.FC = (theme) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const isDark = DarkLight(theme);

  const login = (email: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email: email,
      avatar: `https://picsum.photos/seed/${email}/200`,
      credits: 100
    };
    setUser(newUser);
    localStorage.setItem('echo_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('echo_user');
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl">
      <div
        className={`w-full max-w-4xl rounded-[2.5rem] overflow-hidden border shadow-2xl ${
          isDark
            ? 'bg-[#1F2833] border-white/10 text-[#C5C6C7]'
            : 'bg-white border-gray-200 text-[#1F2833]'
        }`}
      >
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 bg-indigo-600 rounded-[2rem] items-center justify-center shadow-2xl shadow-indigo-600/30 mb-4">
            <Zap className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold">Welcome to VoxPact</h2>
          <p className="text-gray-400">
            {isRegistering ? 'Create your account to start talking' : 'Sign in to access your assistant'}
          </p>
        </div>

        <div className="glass rounded-[2.5rem] p-8 border border-white/5 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600/50 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all transform active:scale-[0.98]"
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0a] px-2 text-gray-500 font-bold">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => login('google-user@gmail.com')}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Chrome size={18} />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              onClick={() => login('github-user@github.com')}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Github size={18} />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-indigo-400 font-bold hover:underline"
          >
            {isRegistering ? 'Sign in' : 'Sign up for free'}
          </button>
        </p>
      </div>
    </div>
  );
};
