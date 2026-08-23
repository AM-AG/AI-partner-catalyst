import { Theme } from '@/types/types';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

type LayoutProps = {
  theme: Theme;
  onThemeToggle: () => void;
};


export default function Layout({ theme, onThemeToggle }: LayoutProps) {

  const isDark = theme === 'dark';
  const t = (dark: string, light: string) => (isDark ? dark : light);

  const pageTheme = isDark
    ? 'bg-gradient-to-br from-[#0B0C10] via-[#0B0C10] to-[#0F1B1C] text-[#C5C6C7]'
    : 'bg-gradient-to-br from-[#F8F9FA] via-[#F8F9FA] to-[#EAF7F7] text-[#1F2833]';

  const toggleTheme = isDark
    ? 'border-white/10 bg-white/5 text-[#66FCF1]'
    : 'border-black/40 bg-white/70 text-[#007AFF]';

  return (
    <div className={`h-screen w-full flex flex-col items-center relative overflow-y-auto transition-colors duration-300 ${pageTheme}`}
    >
      {/* Gradient and animated background */}
      <div className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true">
        <div className="animate-orb-slow absolute -top-[25%] left-[25%] h-[80vw] w-[80vw] rounded-full bg-[#66FCF1] opacity-[0.05] blur-[120px] sm:h-[1200px] sm:w-[1200px] sm:blur-[180px]" />
        <div className="animate-orb-slow-reverse absolute -right-[25%] -bottom-[25%] h-[70vw] w-[70vw] rounded-full bg-[#45A29E] opacity-[0.03] blur-[100px] sm:h-[1000px] sm:w-[1000px] sm:blur-[180px]" />
      </div>

      <Header isDark={isDark} onThemeToggle={onThemeToggle} />


      <main className="relative z-10 flex w-full flex-1 pt-20 p-6">
         <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8">
            <Outlet />
          </div>
       </main>

      {/* Footer */}
      <Footer isDark={theme}/>
    </div>
  );
}




// export default function Layout({ theme, onThemeToggle }: LayoutProps) {
  
//   const isDark = theme === 'dark';
//   const t = (dark: string, light: string) => (isDark ? dark : light);

//   const pageTheme = isDark
//     ? 'bg-gradient-to-br from-[#0B0C10] via-[#0B0C10] to-[#0F1B1C] text-[#C5C6C7]'
//     : 'bg-gradient-to-br from-[#F8F9FA] via-[#F8F9FA] to-[#EAF7F7] text-[#1F2833]';

//   const toggleTheme = isDark
//     ? 'border-white/5 bg-white/5 text-[#66FCF1]'
//     : 'border-black/5 bg-white/70 text-[#007AFF]';


//   return (
//     <div className={`relative overflow-y-auto flex min-h-screen w-full flex-col 
//         transition-colors duration-500 ${pageTheme}`}>

//       {/* Gradient and animated background */}
//       <div className="pointer-events-none fixed inset-0 z-0"
//         aria-hidden="true">
//         <div className="animate-orb-slow absolute -top-[25%] left-[25%] h-[80vw] w-[80vw] rounded-full bg-[#66FCF1] opacity-[0.05] blur-[120px] sm:h-[1200px] sm:w-[1200px] sm:blur-[180px]" />
//         <div className="animate-orb-slow-reverse absolute -right-[25%] -bottom-[25%] h-[70vw] w-[70vw] rounded-full bg-[#45A29E] opacity-[0.03] blur-[100px] sm:h-[1000px] sm:w-[1000px] sm:blur-[180px]" />
//       </div>

//       {/* Header */}
//       <header className="relative z-30 flex w-full items-start justify-between px-4 py-6 sm:px-8">
//         <img
//           src="/images/logo_test.svg"
//           alt="Voxpact Logo"
//           className="h-auto w-24 rounded-full sm:w-32"
//         />

//         <button
//           onClick={onThemeToggle}
//           className={`flex items-center gap-3 p-4 rounded-full border-2 backdrop-blur-md shadow-2xl transition-all duration-500 ${t(
//             'border-white/5 bg-white/5 text-[#66FCF1]',
//             'border-black/5 bg-white text-[#007AFF]'
//           )}`}
//         >
//           <span className="text-[11px] font-black uppercase tracking-[0.2em]">
//             {isDark ? 'Light' : 'Dark'}
//           </span>
//         </button>
//       </header>

//       {/* Routed page */}
//       <main className="relative z-10 flex w-full flex-1">
//         <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8">
//           <Outlet />
//         </div>
//       </main>

//       {/* Footer */}
//       <div className="relative z-10 w-full">
//         <Footer />
//       </div>
//     </div>
//   );
// }