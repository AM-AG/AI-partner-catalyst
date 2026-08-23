
import { CORE_FEATURES, FOOTER_LINKS } from '@/services/parameters';
import { Theme } from '@/types/types';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    url: "https://facebook.com/yourprofile",
    icon: <Facebook strokeWidth={0.75} className="w-5 h-5" />,
    color: "hover:text-[#1877F2]", // Facebook blue overlay on hover
  },
  {
    name: "Instagram",
    url: "https://instagram.com/yourprofile",
    icon: <Instagram strokeWidth={0.75} className="w-5 h-5" />,
    color: "hover:text-[#E1306C]", // Instagram pink gradient approximation
  },
  { 
    name: "X", 
    url: "https://x.com/yourprofile", 
    icon: <Twitter strokeWidth={0.75} className="w-5 h-5" /> ,
    color: "hover:text-[#1DA1F2]",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/yourprofile",
    icon: <Linkedin strokeWidth={0.75} className="w-5 h-5" />,
    color: "hover:text-[#0A66C2]", // LinkedIn blue
  },
  {
    name: "YouTube",
    url: "https://youtube.com/yourprofile",
    icon: <Youtube strokeWidth={0.75} className="w-5 h-5" />,
    color: "hover:text-[#FF0000]", // YouTube red
  },
];


export const Footer:any = (isDark: Theme) => {

    const footerTheme = isDark 
    ? 'border-white/10 bg-[#0B0C10]/70 text-[#C5C6C7]' 
    : 'border-black/10 bg-[#F8F9FA]/70 text-[#1F2833]'; 
    
    const mutedText = isDark 
    ? 'text-[#C5C6C7]/60' 
    : 'text-[#1F2833]/60'; 
    
    const linkStyle = isDark 
    ? 'text-[#C5C6C7]/50 hover:text-[#66FCF1]' 
    : 'text-[#1F2833]/50 hover:text-[#007AFF]';

    // return (
    //   <footer className={`w-full border-t border-gray-500/10 px-6 py-12 sm:px-8 ${footerTheme}`}>
    //     <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
    //       {/* Brand */}
    //       <div className="max-w-sm">
    //         <Link
    //           to="/"
    //           className="mb-5 inline-flex items-center gap-2 transition-opacity hover:opacity-80"
    //           aria-label="Voxpact home"
    //         >
    //           <img
    //             src="/images/logo_test.svg"
    //             alt=""
    //             className="h-auto w-14"
    //           />

    //           <span className="text-xl font-black tracking-tight">
    //             VOXPACT
    //           </span>
    //         </Link>

    //         <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
    //           Curating the world&apos;s most important platform powered by AI
    //           tools. Stay ahead with Voxpact.
    //         </p>
    //       </div>

    //       {/* Navigation links */}
    //       <nav aria-label="Footer navigation">
    //         <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:justify-start">
    //           {FOOTER_LINKS.map((link) => (
    //             <li key={link.id}>
    //               <Link
    //                 to={link.path}
    //                 className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-50 transition-opacity duration-200 hover:opacity-100 focus:opacity-100"
    //               >
    //                 {link.label}
    //               </Link>
    //             </li>
    //           ))}
    //         </ul>
    //       </nav>

    //       {/* Social links */}
    //       <div className="flex items-center justify-center gap-5 md:justify-end">
    //         {SOCIAL_LINKS.map((social) => (
    //           <a
    //             key={social.name}
    //             href={social.url}
    //             target="_blank"
    //             rel="noopener noreferrer"
    //             aria-label={`Visit Voxpact on ${social.name}`}
    //             className={`opacity-50 transition-all duration-200 hover:scale-110 hover:opacity-100 focus:scale-110 focus:opacity-100 ${social.color}`}
    //           >
    //             {social.icon}
    //           </a>
    //         ))}
    //       </div>
    //     </div>

    //     {/* Copyright */}
    //     <div className="mx-auto mt-10 w-full max-w-7xl border-t border-gray-500/10 pt-6 text-center">
    //       <p className="text-[10px] uppercase tracking-widest opacity-40">
    //         © 2025 Voxpact. All rights reserved.
    //       </p>
    //     </div>
    //   </footer>
    // )

    return ( 
      <footer className={`w-full border-t border-gray-500/10 px-6 py-12 sm:px-8 backdrop-blur-md transition-colors duration-500 ${footerTheme}`} > 
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-start md:justify-between"> 
          {/* Brand */} 
          <div className="max-w-sm"> 
            <Link to="/" className="mb-5 inline-flex items-center gap-2 transition-opacity hover:opacity-80" > 
              <img src="/images/logo_test.svg" alt="Voxpact" className="h-auto w-14 rounded-full" /> 
              <span className="text-xl font-black tracking-tight"> VOXPACT </span> 
            </Link> 
            
            <p className={`text-sm leading-relaxed ${mutedText}`}> 
              Curating the world&apos;s most important platform powered by AI tools. Stay ahead with Voxpact. 
            </p> 
          </div> 
          {/* Navigation */} 
          <nav aria-label="Footer navigation"> 
            <ul className="flex flex-wrap gap-x-8 gap-y-4"> 
              {FOOTER_LINKS.map((link) => ( 
                <li key={link.id}> 
                  <Link to={link.path} className={`text-[10px] font-semibold uppercase tracking-[0.25em] 
                      transition-colors duration-300 ${linkStyle}`} > 
                    {link.label} 
                  </Link> 
                </li> ))} 
            </ul> 
          </nav> 
          
          {/* Social links */}
          <div className="flex items-center gap-3"> 
            {SOCIAL_LINKS.map((social) => ( 
              <a key={social.name} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={`Visit Voxpact on ${social.name}`} 
                className={`text-lg opacity-50 transition-all duration-300 hover:scale-110 hover:opacity-100 ${social.color}`} > 
                {social.icon} 
              </a> ))} 
          </div> 
        </div> 
        
        {/* Copyright */} 
        <div className={`mx-auto w-full max-w-7xl border-t px-6 py-6 text-center ${ isDark ? 'border-white/10' : 'border-black/10' }`} > 
          <p className={`text-[10px] uppercase tracking-widest ${mutedText}`}> 
            © 2025 Voxpact. All rights reserved. 
          </p> 
        </div> 
      </footer> 
); 

}
