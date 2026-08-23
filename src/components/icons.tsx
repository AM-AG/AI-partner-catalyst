

export const AttachIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 5v10m0 0l-3-3m3 3l3-3M5 19h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const DocIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export const MicIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M19 11a7 7 0 01-14 0M12 18v3"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
)

export const SendIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M22 2L11 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M22 2L15 22l-4-9-9-4 20-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
)
