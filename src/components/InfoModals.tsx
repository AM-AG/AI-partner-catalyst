import React, { useState } from 'react';
import { Theme, ModalType, InfoModalProps, User } from '../../types/types';
import { X, Mail, Lock, Github, Chrome } from "lucide-react";
import { PRICING_PLANS, handleBuyCredits } from '../../services/parameters';
import { db, STARTING_CREDITS } from '../../store/db';
import { About } from '../pages/company/About';
import { Sdk } from '../pages/company/Sdk';
import { LoginForm } from "@/src/pages/company/LoginForm";
import { Privacy } from "@/src/pages/company/Privacy";
import { Partners } from "@/src/pages/company/Partners";
import { Pricing } from "@/src/pages/company/Pricing";

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, theme }) => {
  const isDark = theme === 'dark';

  /* ------------------------------ */
  /* Small primitives */
  /* ------------------------------ */
  // const content: Record<ModalType,{ title: string; body: React.ReactNode }> = {
  //   SDK: {
  //     title: 'Developer SDK',
  //      body: '',//<Sdk theme={theme}/>
  //   },

  //   PRICING: {
  //     title: 'Credit Packs',
  //     body: '',// <Pricing theme={theme}/>
  //   },

  //   ABOUT: {
  //     title: 'About',
  //     body: '',//<About />,
  //   },

  //   PRIVACY: {
  //     title: 'Privacy',
  //     body:'',// <Privacy />
  //   },

  //   AFFILIATION: {
  //     title: 'Partners',
  //     body: <Partners theme={theme} />
  //   },
  //   LOGIN:{
  //     title: "Log in to your account",
  //     body: <LoginForm/>
  //   }
  // };
  


  /* ------------------------------ */
  /* Render */
  /* ------------------------------ */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl">
      <div
        className={`w-full max-w-4xl rounded-[2.5rem] overflow-hidden border shadow-2xl ${
          isDark
            ? 'bg-[#1F2833] border-white/10 text-[#C5C6C7]'
            : 'bg-white border-gray-200 text-[#1F2833]'
        }`}
      >
        {/* <div className="p-10">
          <header className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight uppercase">
              {content[type].title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:opacity-60 transition"
            >
              <X size={20} />
            </button>
          </header>

          <div className="max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            {content[type].body}
          </div>
        </div>

        <footer className="border-t p-3 text-center text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">
          آ© 2025 Voxpact. All rights reserved.
        </footer> */}
      </div>
    </div>
  );
};
