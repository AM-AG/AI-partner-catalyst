// import React, { useState } from 'react';
// import { DarkLight, handleBuyCredits, PRICING_PLANS } from '../../services/parameters';
// import { Theme, User } from '../../types/types';
// import { X } from "lucide-react";
// import { db } from '../../store/db';
// import { useApiKeys } from '../../hooks/useapikey';
// import { Pricing } from '../pages/company/Pricing';
// import { useAuth } from '../../hooks/useAuth';

// export interface AccountProps {
//   theme: Theme;
//   onUpdateCredits: (amount: number) => void;
// }


// export const Account: React.FC<AccountProps> = ({theme, onUpdateCredits}) => {

//   const isDark = DarkLight(theme);
//   const [showBuyModal, setShowBuyModal] = useState(false);

//   const { user } = useAuth();
//   const { keys, setKeys, createKey } = useApiKeys(user?.id ?? '');

//   return (
//     <div
//       className={`flex flex-col h-full relative overflow-hidden transition-colors ${
//         isDark ? 'bg-[#0B0C10] text-[#C5C6C7]' : 'bg-[#F8F9FA] text-[#1F2833]'
//       }`}
//     >
//       {/* Header */}
//       <div className="px-6 md:px-12 pt-14 pb-10">
//         <h1 className="text-[14px] font-black uppercase tracking-[0.5em]">
//           Account
//         </h1>
//         <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">
//           User Profile & Billing
//         </p>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-32 space-y-10 custom-scrollbar">

//         {/* User Info */}
//         <section
//           className={`rounded-[2rem] border p-8 ${
//             isDark
//               ? 'bg-[#1F2833]/40 border-white/5'
//               : 'bg-white border-gray-200 shadow-sm'
//           }`}
//         >
//           <p className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-50">
//             Profile
//           </p>

//           <div className="mt-6 space-y-2 text-[12px]">
//             <div>
//               <span className="opacity-40">Email:</span>{' '}
//               <span className="font-mono px-6">{user?.email ?? 'â€”'}</span>
//             </div>
//             <div>
//               <span className="opacity-40">User ID:</span>{' '}
//               <span className="font-mono px-6">{user?.user_id ?? 'â€”'}</span>
//             </div>
//           </div>
//         </section>

//         {/* Api keys */}
//         <section className={`rounded-[2rem] border p-8 ${
//             isDark
//               ? 'bg-[#1F2833]/40 border-white/5'
//               : 'bg-white border-gray-200 shadow-sm'
//           }`}>
//             <p className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-50">
//             Api Keys
//             </p>
//             {keys.map(key => (
//                 <div key={key.id} className="flex justify-between items-center">
//                     <div>
//                     <div className="font-mono text-xs">
//                         â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ {key.lastFour}
//                     </div>
//                     <div className="text-[10px] opacity-50">
//                         Created {new Date(key.createdAt).toLocaleDateString()}
//                     </div>
//                     </div>

//                     <button
//                     onClick={() => {
//                         db.deleteapikey(key.id);
//                         setKeys(prev => prev.filter(k => k.id !== key.id));
//                     }}
//                     className="text-red-400 text-xs"
//                     >
//                     Delete
//                     </button>
//                 </div>
//                 ))}
//         </section>

//         {/* Credits */}
//         <section
//           className={`rounded-[2rem] border p-8 ${
//             isDark
//               ? 'bg-[#1F2833]/40 border-white/5'
//               : 'bg-white border-gray-200 shadow-sm'
//           }`}
//         >
//           <p className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-50">
//             Credits
//           </p>

//           <div className="mt-6 flex items-center justify-between">
//             <div className="text-[28px] font-black tracking-tight">
//               {user?.credits ?? 0}
//               <span className="text-[10px] font-mono opacity-40 ml-2 uppercase">
//                 Units
//               </span>
//             </div>

//             <button
//               onClick={() => setShowBuyModal(true)}
//               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] transition-all ${
//                 isDark
//                   ? 'bg-[#66FCF1]/10 text-[#66FCF1] hover:bg-[#66FCF1]/20'
//                   : 'bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20'
//               }`}
//             >
//               Buy Credits
//             </button>
//           </div>
//         </section>
//       </div>

//       {/* Buy Credits Modal */}
//       {showBuyModal && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
//           <div
//             className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
//               rounded-[2.5rem] p-10 transition-all duration-300
//               ${isDark ? 'bg-[#0B0C10]' : 'bg-white'}
//             `}
//           >
//             <button
//               onClick={() => setShowBuyModal(false)}
//               className="absolute top-6 right-6 text-xs opacity-40 hover:opacity-80"
//             >
//               <X size={20} />
//             </button>

//             <p className="text-[11px] font-mono uppercase tracking-[0.4em] opacity-50">
//               Purchase Credits
//             </p>
//             <Pricing theme={theme} user={user ? user : ""}/>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { DarkLight } from '../../services/parameters';
import { Theme } from '../../types/types';
import {X, Save, CheckCircle2, AlertCircle, KeyRound, CreditCard, UserRound, ChevronDown} from 'lucide-react';
import { db } from '../../store/db';
import { useApiKeys } from '../../hooks/useapikey';
import { Pricing } from '../pages/company/Pricing';
import { useAuth } from '../../hooks/useAuth';

export interface AccountProps {
  theme: Theme;
  onUpdateCredits: (amount: number) => void;
}

interface ProfileForm {
  name: string;
  email: string;
  avatar: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

const AVATAR_OPTIONS = [
  '😀',
  '😎',
  '🤖',
  '👾',
  '🦊',
  '🐼',
  '🐸',
  '🐙',
  '🦄',
  '🐯',
  '🐨',
  '🚀',
];

export const Account: React.FC<AccountProps> = ({
  theme,
  onUpdateCredits,
}) => {
  const isDark = DarkLight(theme);
  const { user } = useAuth();
  const { keys, setKeys } = useApiKeys(user?.id ?? '');
  const DEFAULT_AVATAR = '😀';

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    name: '',
    email: '',
    avatar: DEFAULT_AVATAR,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  /*
   * Populate the profile form when the authenticated user
   * becomes available.
   */
  const getAvatar = (avatar?: string | null) => {
    if (!avatar) return DEFAULT_AVATAR;

    if (
      avatar.startsWith('http://') ||
      avatar.startsWith('https://')
    ) {
      return avatar;
    }

    if (AVATAR_OPTIONS.includes(avatar)) {
      return avatar;
    }

    return DEFAULT_AVATAR;
  };
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name ?? '',
      email: user.email ?? '',
      avatar: getAvatar(user.avatar),
    });
  }, [user]);


  const updateField = (
    field: keyof ProfileForm,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));

    setSaveMessage(null);
    setSaveError(null);
  };

  const handleAvatarSelect = (avatar: string) => {
    updateField('avatar', avatar);
    setShowAvatarPicker(false);
  };

  const handleSaveProfile = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!user?.id) {
      setSaveError(
        'Unable to identify your account. Please sign in again.'
      );
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setSaveError('Please enter your name.');
      return;
    }

    if (!email) {
      setSaveError('Email address is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSaveError('Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const response = await fetch('/api/User/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: user.id,
          name,
          email,
          avatar: form.avatar,
        }),
      });

      const data: ApiResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to update your profile.'
        );
      }

      if (data.user) {
        setForm({
          name: data.user.name ?? name,
          email: data.user.email ?? email,
          avatar: data.user.avatar ?? form.avatar,
        });
      }

      setSaveMessage(
        data.message || 'Your profile has been updated.'
      );
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while updating your profile.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      await db.deleteapikey(keyId);

      setKeys(prev =>
        prev.filter(key => key.id !== keyId)
      );
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const cardClass = `rounded-[2rem] border p-8
    ${
      isDark
        ? 'bg-[#1F2833]/40 border-white/5'
        : 'bg-white border-gray-200 shadow-sm'
    }`;

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none
    transition-all
    ${
      isDark
        ? 'bg-black/20 border-white/10 text-white placeholder:text-white/20 focus:border-[#66FCF1]/50 focus:ring-2 focus:ring-[#66FCF1]/10'
        : 'bg-gray-50 border-gray-200 text-[#1F2833] placeholder:text-gray-400 focus:border-[#007AFF]/50 focus:ring-2 focus:ring-[#007AFF]/10'
    }`;

  const accentClass = isDark ? 'text-[#66FCF1]' : 'text-[#007AFF]';
  const accentBackgroundClass = isDark ? 'bg-[#66FCF1]/10' : 'bg-[#007AFF]/10';

  return (
    <div
      className={`flex flex-col h-full relative overflow-hidden transition-colors ${
        isDark
          ? 'bg-[#0B0C10] text-[#C5C6C7]'
          : 'bg-[#F8F9FA] text-[#1F2833]'
      }`}
    >
      {/* Header */}
      <header className="px-6 md:px-12 pt-14 pb-10">
        <h1 className="text-[14px] font-black uppercase tracking-[0.5em]">
          Account
        </h1>

        <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">
          Profile & Billing
        </p>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-32 space-y-8 custom-scrollbar">

        {/* ========================================================= */}
        {/* Profile */}
        {/* ========================================================= */}

        <section className={cardClass}>
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentBackgroundClass} ${accentClass}`}
            >
              <UserRound size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold">
                Personal information
              </h2>

              <p className="mt-1 text-xs opacity-40">
                Update your name, email address and avatar.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="mt-8 space-y-6"
          >
            {/* Avatar + Name */}
            <div className="flex flex-col sm:flex-row items-start gap-6">

              {/* Avatar */}
              <div className="relative">
                <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.25em] opacity-50">
                  Avatar
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setShowAvatarPicker(prev => !prev)
                  }
                  className={`
                    group relative flex h-24 w-24 items-center
                    justify-center rounded-2xl border
                    text-5xl transition-all
                    ${
                      isDark
                        ? 'bg-black/20 border-white/10 hover:border-[#66FCF1]/40'
                        : 'bg-gray-50 border-gray-200 hover:border-[#007AFF]/40'
                    }
                  `}
                  aria-label="Choose avatar"
                >
                  {form.avatar.startsWith('http') ? (
                    <img
                      src={form.avatar}
                      alt="Profile avatar"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <span>{form.avatar}</span>
                  )}

                  <span
                    className={`
                      absolute inset-0 flex items-end justify-end
                      p-2 opacity-0 transition-opacity
                      group-hover:opacity-100
                    `}
                  >
                    <span
                      className={`
                        flex h-7 w-7 items-center justify-center
                        rounded-lg backdrop-blur-md
                        ${
                          isDark
                            ? 'bg-black/60 text-white'
                            : 'bg-white/80 text-gray-700'
                        }
                      `}
                    >
                      <ChevronDown size={14} />
                    </span>
                  </span>
                </button>

                {/* Avatar picker */}
                {showAvatarPicker && (
                  <div
                    className={`
                      absolute left-0 top-full z-30 mt-3 w-72
                      rounded-2xl border p-4 shadow-2xl
                      ${
                        isDark
                          ? 'bg-[#15191F] border-white/10'
                          : 'bg-white border-gray-200'
                      }
                    `}
                  >
                    <div className="mb-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em]">
                        Choose avatar
                      </p>

                      <p className="mt-1 text-[10px] opacity-40">
                        Select an avatar for your profile.
                      </p>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {AVATAR_OPTIONS.map(avatar => {
                        const selected = form.avatar === avatar;

                        return (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() =>
                              handleAvatarSelect(avatar)
                            }
                            className={`
                              flex h-10 w-10 items-center
                              justify-center rounded-xl
                              text-xl transition-all
                              ${
                                selected
                                  ? isDark
                                    ? 'bg-[#66FCF1]/20 ring-1 ring-[#66FCF1]/60'
                                    : 'bg-[#007AFF]/10 ring-1 ring-[#007AFF]/50'
                                  : isDark
                                    ? 'hover:bg-white/5'
                                    : 'hover:bg-gray-100'
                              }
                            `}
                            aria-label={`Select avatar ${avatar}`}
                          >
                            {avatar}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 w-full">
                <label
                  htmlFor="name"
                  className="mb-2 block text-[10px] font-mono uppercase tracking-[0.25em] opacity-50"
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={e =>
                    updateField('name', e.target.value)
                  }
                  placeholder="Your name"
                  autoComplete="name"
                  maxLength={100}
                  className={inputClass}
                />

                <p className="mt-2 text-[10px] opacity-30">
                  This name will be displayed across your account.
                </p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[10px] font-mono uppercase tracking-[0.25em] opacity-50"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={form.email}
                onChange={e =>
                  updateField('email', e.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                className={inputClass}
              />
            </div>

            {/* User ID */}
            <div>
              <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.25em] opacity-50">
                User ID
              </label>

              <div
                className={`
                  rounded-xl border px-4 py-3 font-mono text-xs
                  ${
                    isDark
                      ? 'border-white/5 bg-black/20 text-white/40'
                      : 'border-gray-200 bg-gray-50 text-gray-400'
                  }
                `}
              >
                {user?.user_id ?? user?.id ?? '—'}
              </div>

              <p className="mt-2 text-[10px] opacity-30">
                Your user ID cannot be changed.
              </p>
            </div>

            {/* Feedback */}
            {saveMessage && (
              <div
                className={`
                  flex items-center gap-2 rounded-xl
                  px-4 py-3 text-xs
                  ${
                    isDark
                      ? 'bg-emerald-400/10 text-emerald-300'
                      : 'bg-emerald-50 text-emerald-700'
                  }
                `}
              >
                <CheckCircle2 size={15} />
                {saveMessage}
              </div>
            )}

            {saveError && (
              <div
                className={`
                  flex items-center gap-2 rounded-xl
                  px-4 py-3 text-xs
                  ${
                    isDark
                      ? 'bg-red-400/10 text-red-300'
                      : 'bg-red-50 text-red-700'
                  }
                `}
              >
                <AlertCircle size={15} />
                {saveError}
              </div>
            )}

            {/* Save */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className={`
                  inline-flex items-center gap-2 rounded-xl
                  px-6 py-3 text-[10px] font-black
                  uppercase tracking-[0.3em]
                  transition-all
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  ${
                    isDark
                      ? 'bg-[#66FCF1] text-[#0B0C10] hover:bg-[#8dfffa]'
                      : 'bg-[#007AFF] text-white hover:bg-[#006de0]'
                  }
                `}
              >
                <Save size={14} />

                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </section>

        {/* ========================================================= */}
        {/* API Keys */}
        {/* ========================================================= */}

        <section className={cardClass}>
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentBackgroundClass} ${accentClass}`}
            >
              <KeyRound size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold">
                API keys
              </h2>

              <p className="mt-1 text-xs opacity-40">
                Manage the API keys associated with your account.
              </p>
            </div>
          </div>

          <div className="mt-8">
            {keys.length === 0 ? (
              <div
                className={`
                  rounded-xl border border-dashed
                  px-6 py-8 text-center
                  ${
                    isDark
                      ? 'border-white/10'
                      : 'border-gray-200'
                  }
                `}
              >
                <KeyRound
                  size={20}
                  className="mx-auto opacity-30"
                />

                <p className="mt-3 text-xs opacity-50">
                  No API keys found.
                </p>
              </div>
            ) : (
              <div
                className={
                  isDark
                    ? 'divide-y divide-white/5'
                    : 'divide-y divide-gray-100'
                }
              >
                {keys.map(key => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-xs">
                        •••• •••• •••• {key.lastFour}
                      </div>

                      <div className="mt-1 text-[10px] opacity-40">
                        Created{' '}
                        {new Date(
                          key.createdAt
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteApiKey(key.id)
                      }
                      className="shrink-0 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-400/10"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* Credits */}
        {/* ========================================================= */}

        <section className={cardClass}>
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentBackgroundClass} ${accentClass}`}
            >
              <CreditCard size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold">
                Credits
              </h2>

              <p className="mt-1 text-xs opacity-40">
                Manage your available usage credits.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="text-[32px] font-black tracking-tight">
                {user?.credits ?? 0}
              </div>

              <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.25em] opacity-40">
                Available units
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBuyModal(true)}
              className={`
                px-6 py-3 rounded-xl text-[10px]
                font-black uppercase tracking-[0.4em]
                transition-all
                ${
                  isDark
                    ? 'bg-[#66FCF1]/10 text-[#66FCF1] hover:bg-[#66FCF1]/20'
                    : 'bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20'
                }
              `}
            >
              Buy credits
            </button>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* Buy Credits Modal */}
      {/* ========================================================= */}

      {showBuyModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setShowBuyModal(false);
            }
          }}
        >
          <div
            className={`
              relative w-full max-w-3xl max-h-[90vh]
              overflow-y-auto rounded-[2.5rem] p-8 md:p-10
              ${
                isDark
                  ? 'bg-[#0B0C10]'
                  : 'bg-white'
              }
            `}
          >
            <button
              type="button"
              onClick={() => setShowBuyModal(false)}
              aria-label="Close purchase credits dialog"
              className="absolute top-6 right-6 rounded-lg p-2 opacity-40 transition-opacity hover:opacity-80"
            >
              <X size={20} />
            </button>

            <p className="text-[11px] font-mono uppercase tracking-[0.4em] opacity-50">
              Purchase credits
            </p>

            <div className="mt-6">
              <Pricing
                theme={theme}
                user={user ?? ''}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};