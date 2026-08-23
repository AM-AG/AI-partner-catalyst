

export const AppLayout = ({ children, isDark }) => (
  <div className={`flex h-screen w-screen ${isDark ? 'dark' : 'light'}`}>
    {/* ambience */}
    {children}
  </div>
);