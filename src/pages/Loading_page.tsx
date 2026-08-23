import React from 'react';



interface LoadingPageProps {
  theme?: 'dark' | 'light';
}


export default function LoadingPage({ theme = 'dark' }: LoadingPageProps) {
  const isDark = theme === 'dark';

  const pageTheme = isDark
    ? 'bg-gradient-to-br from-[#0B0C10] via-[#0B0C10] to-[#0F1B1C] text-[#C5C6C7]'
    : 'bg-gradient-to-br from-[#F8F9FA] via-[#F8F9FA] to-[#EAF7F7] text-[#1F2833]';

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex min-h-screen w-full
        items-center justify-center
        overflow-hidden
        transition-colors duration-300
        ${pageTheme}
      `}
    >
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Main cyan glow */}
        <div
          className={`
            animate-orb-slow
            absolute
            -top-[30%]
            left-[15%]
            h-[650px]
            w-[650px]
            rounded-full
            bg-[#66FCF1]
            blur-[150px]
            ${isDark ? 'opacity-[0.045]' : 'opacity-[0.08]'}
          `}
        />

        {/* Secondary teal glow */}
        <div
          className={`
            animate-orb-slow-reverse
            absolute
            -bottom-[30%]
            -right-[15%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#45A29E]
            blur-[140px]
            ${isDark ? 'opacity-[0.035]' : 'opacity-[0.06]'}
          `}
        />

        {/* Subtle center glow */}
        <div
          className={`
            absolute
            left-1/2
            top-1/2
            h-[300px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#66FCF1]
            blur-[180px]
            ${isDark ? 'opacity-[0.025]' : 'opacity-[0.04]'}
          `}
        />

        {/* Grid */}
        <div
          className={`
            absolute inset-0
            opacity-[0.025]
            ${isDark ? 'bg-grid-dark' : 'bg-grid-light'}
          `}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6">

        {/* Logo */}
        <div className="relative mb-8">
          {/* Glow behind logo */}
          <div
            className="
              absolute
              inset-0
              rounded-2xl
              bg-[#66FCF1]
              opacity-20
              blur-2xl
            "
          />

          <div
            className={`
              relative
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              backdrop-blur-xl
              ${isDark
                ? 'border-[#66FCF1]/20 bg-white/[0.03]'
                : 'border-[#007AFF]/20 bg-white/60'
              }
            `}
          >
            {/* Replace this with your actual logo */}
            <div className="relative h-7 w-7">
              <div
                className="
                  absolute
                  inset-0
                  rotate-45
                  rounded-[8px]
                  border-2
                  border-[#66FCF1]
                "
              />

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-3
                  w-3
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#66FCF1]
                  shadow-[0_0_18px_rgba(102,252,241,0.8)]
                "
              />
            </div>
          </div>
        </div>

        {/* Brand */}
        <h1
          className={`
            text-2xl
            font-semibold
            tracking-tight
            ${isDark ? 'text-white' : 'text-[#1F2833]'}
          `}
        >
          Your App
        </h1>

        <p
          className={`
            mt-2
            text-sm
            ${isDark ? 'text-[#C5C6C7]/50' : 'text-[#1F2833]/50'}
          `}
        >
          Preparing your workspace
        </p>

        {/* Loading animation */}
        <div className="mt-12 flex flex-col items-center">

          {/* Spinner */}
          <div className="relative h-12 w-12">

            {/* Track */}
            <div
              className={`
                absolute
                inset-0
                rounded-full
                border-2
                ${isDark
                  ? 'border-white/[0.06]'
                  : 'border-black/[0.06]'
                }
              `}
            />

            {/* Animated ring */}
            <div
              className="
                absolute
                inset-0
                animate-spin
                rounded-full
                border-2
                border-transparent
                border-t-[#66FCF1]
                border-r-[#45A29E]
              "
              style={{
                animationDuration: '1.1s',
              }}
            />

            {/* Center */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-1.5
                w-1.5
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#66FCF1]
                shadow-[0_0_12px_rgba(102,252,241,0.9)]
              "
            />
          </div>

          {/* Loading text */}
          <div className="mt-6 flex items-center gap-2">
            <span
              className={`
                text-[11px]
                font-medium
                uppercase
                tracking-[0.25em]
                ${isDark
                  ? 'text-[#C5C6C7]/40'
                  : 'text-[#1F2833]/40'
                }
              `}
            >
              Loading
            </span>

            <span className="flex gap-1">
              <span
                className="h-1 w-1 animate-pulse rounded-full bg-[#66FCF1]"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="h-1 w-1 animate-pulse rounded-full bg-[#66FCF1]"
                style={{ animationDelay: '200ms' }}
              />
              <span
                className="h-1 w-1 animate-pulse rounded-full bg-[#66FCF1]"
                style={{ animationDelay: '400ms' }}
              />
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-10 w-full">
          <div
            className={`
              h-[3px]
              w-full
              overflow-hidden
              rounded-full
              ${isDark
                ? 'bg-white/[0.06]'
                : 'bg-black/[0.06]'
              }
            `}
          >
            <div
              className="
                h-full
                w-[65%]
                animate-loading-progress
                rounded-full
                bg-gradient-to-r
                from-[#45A29E]
                via-[#66FCF1]
                to-[#66FCF1]
                shadow-[0_0_12px_rgba(102,252,241,0.35)]
              "
            />
          </div>
        </div>

        {/* Status */}
        <div className="mt-5 flex w-full items-center justify-between">
          <span
            className={`
              text-xs
              ${isDark
                ? 'text-[#C5C6C7]/35'
                : 'text-[#1F2833]/35'
              }
            `}
          >
            Initializing workspace
          </span>

          <span
            className="
              text-xs
              font-medium
              text-[#66FCF1]
            "
          >
            Please wait
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div
        className={`
          absolute
          bottom-7
          left-0
          right-0
          text-center
          text-[11px]
          ${isDark
            ? 'text-[#C5C6C7]/25'
            : 'text-[#1F2833]/30'
          }
        `}
      >
        Your workspace is being prepared securely
      </div>
    </div>
  );
};