import { Theme } from '@/types/types';
import { Link } from 'react-router-dom';


type HeaderProps = {
  isDark: Theme;
  onThemeToggle: () => void;
};


export const Header:any = ({isDark, onThemeToggle}: HeaderProps) => {

    const HeaderTheme = isDark 
    ? 'border-white/10 bg-[#0B0C10]/70 text-[#C5C6C7]' 
    : 'border-black/10 bg-[#F8F9FA]/70 text-[#1F2833]'; 
    
    const mutedText = isDark 
    ? 'text-[#C5C6C7]/60' 
    : 'text-[#1F2833]/60'; 

    const toggleTheme = isDark
    ? 'border-white/5 bg-white/5 text-[#66FCF1]'
    : 'border-black/5 bg-white/70 text-[#007AFF]';
    
    const linkStyle = isDark 
    ? 'text-[#C5C6C7]/50 hover:text-[#66FCF1]' 
    : 'text-[#1F2833]/50 hover:text-[#007AFF]';


    return ( 
      <header>
        {/* Logo */}
        <div className="absolute top-8 left-8 z-30">
            <Link to="/" className="mb-2 inline-flex items-center gap-2 transition-opacity hover:opacity-80" >
                <img src="/images/logo_test.svg" alt="Voxpact Logo" className="w-32 h-auto mb-4 rounded-full"/>
            </Link>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-8 right-8 z-30">
            <button
            onClick={onThemeToggle}
            className={`flex items-center gap-3 p-4 rounded-full border-2 backdrop-blur-md shadow-2xl transition-all duration-500 ${toggleTheme}`}
            >
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                {isDark ? 'Light' : 'Dark'}
            </span>
            </button>
        </div>

      </header>
); 

}
