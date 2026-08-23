
import React, { useState, useCallback } from 'react';
import { LiveSession } from './components/LiveSession';
import { SmartChat } from './components/SmartChat';
import { VisualStudio } from './components/VisualStudio';
import { LandingPage } from './pages/company/LandingPage';
import { View } from '../services/parameters';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useProjects } from '../hooks/useProjects';
import { Account } from './pages/Account';
import { Settings } from './pages/Settings';
import { NonePage } from './pages/None_page';
import { Routes, Route } from "react-router-dom";
import { Dashboard } from './components/Dashboard';
import { About } from "./pages/company/About"
import { LoginForm } from "./pages/company/LoginForm"
import { Cookies } from "./pages/company/Cookies"
import { Privacy } from "./pages/company/Privacy"
import { Pricing } from "../src/pages/company/Pricing"
import { Sdk } from "../src/pages/company/Sdk"
import { Support } from './pages/Support';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailed } from './pages/PaymentFailed';
import { Partners } from './pages/company/Partners';
import { Terms } from './pages/company/Terms';
import Layout from './components/Layout';
import { ForgotPassword } from './pages/ForgotPassword';
import { Affiliation } from './pages/company/Affiliation';
import { RouteTransition } from './pages/company/transition_page';

// Proposed Names: Venture partner / Venture Peak / VoxPack

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.NONE);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const {user, onUpdateUser, login, logout, handleUpdateCredits, isGoogleConfigured} = useAuth();
  const projects = useProjects(user, currentView);

  const handleLogin = useCallback(() => login('', ''), [login]);

  const isDark = theme === 'dark';

  return (
    <>
      <RouteTransition />
      <Routes>
          <Route path="/" element={<Layout theme={theme} onThemeToggle={toggleTheme} />}>

                <Route path="/" element={ <LandingPage 
                      theme={theme} isGoogleConfigured={isGoogleConfigured}/>} /> 

                <Route path="Login" element={ <LoginForm /> }/>
                <Route path="password/reset" element={<ForgotPassword theme={theme} />} />              
                <Route path="About" element={ <About theme={theme}/> }/>
                <Route path="Terms" element={ <Terms theme={theme}/> }/>
                <Route path="Pricing" element={user ? <Pricing theme={theme} user={user}/> :
                      <Pricing theme={theme} user={""}/> } />
                <Route path="Affiliation" element={ <Affiliation theme={theme}/> } />
                <Route path="Privacy" element={ <Privacy theme={theme}/> } />
                <Route path="Partners" element={ <Partners theme={theme}/> } />
                <Route path="Documentation" element={ <Sdk theme={theme} /> }/>
                <Route path="Cookies" element={ <Cookies theme={theme}/> }/>
          </Route>

          <Route path="/dashboard/User/:userid" element={<Dashboard currentView={currentView} 
                onViewChange={setCurrentView} onupdateUser={onUpdateUser} 
                login={handleLogin} logout={logout} projects={projects} theme={theme} 
                onThemeToggle={toggleTheme} isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(p => !p)}/> } >

              {/* <Route path="" element={ <NonePage theme={theme} /> }/>  */}

              <Route path="Live" element={projects.activeProject ? (
                      <LiveSession
                        key={projects.activeProject.id}
                        project={projects.activeProject}
                        theme={theme}
                        onUpdateCredits={handleUpdateCredits}
                      />
                    ) : null
                } />
              <Route path="Chat" element={projects.activeProject ? (
                    <SmartChat
                      key={projects.activeProject.id}
                      project={projects.activeProject}
                      theme={theme}
                      onUpdateCredits={handleUpdateCredits}
                    />
                  ) : null
                } />

              <Route path="ImageVideo" element={projects.activeProject ? (
                    <VisualStudio
                      // key={projects.activeProject.id}
                      // project={projects.activeProject}
                      // theme={theme}
                      // onUpdateCredits={handleUpdateCredits}
                    />
                  ) : null
                }/>
              <Route path="Account" element={<Account theme={theme} 
                      onUpdateCredits={handleUpdateCredits}/>}/>
              <Route path="Pricing" element={user ? <Pricing theme={theme} user={user}/> :
                      <Pricing theme={theme} user={""}/> } />
              <Route path="Settings" element={<Settings theme={theme}/>}/>
              <Route path="Support" element={<Support theme={theme} />}/>

              <Route path="checkout/success" element={<PaymentSuccess theme={theme} />}/>
              <Route path="checkout/cancelled" element={<PaymentFailed theme={theme} />}/>


          </Route> 
    </Routes>
  </>
  )
}

export default App;
