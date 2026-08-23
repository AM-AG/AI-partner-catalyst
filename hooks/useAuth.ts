// import { useState, useCallback, useEffect } from 'react';
// import { db, STARTING_CREDITS } from '../store/db';
// import { User } from '../types/types';
// import { parseJwt } from '../utils/functions';
// import { useNavigate } from 'react-router-dom';


// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);
//   const navigate = useNavigate();

//   const handleCredentialResponse = useCallback((response: any) => {
//     const payload = parseJwt(response.credential);
//     if (!payload) return;

//     const googleUser: User = {
//       id: payload.sub,
//       user_id: payload.user_id,
//       name: payload.name,
//       email: payload.email,
//       password: undefined,
//       avatar: payload.picture,
//       credits: STARTING_CREDITS,
//     };

//     db.updateUser(googleUser);
//     setUser(googleUser);
//   }, []);

//   useEffect(() => {
//     const persistedUser = db.getUser();
//     if (persistedUser) {
//       setUser(persistedUser);
//     }

//     const hasClientId = Boolean(
//       GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')
//     );
//     if (!hasClientId) return;

//     const initializeGoogle = () => {
//       const google = (window as any)?.google;
//       if (!google?.accounts?.id) return false;

//       google.accounts.id.initialize({
//         client_id: GOOGLE_CLIENT_ID,
//         callback: handleCredentialResponse,
//       });

//       setIsGoogleConfigured(true);
//       return true;
//     };

//     if (initializeGoogle()) return;

//     const interval = window.setInterval(() => {
//       if (initializeGoogle()) {
//         window.clearInterval(interval);
//       }
//     }, 200);

//     return () => window.clearInterval(interval);
//   }, [handleCredentialResponse]);

//   const login = async (email: string, password: string, checkAccount = false): Promise<LoginResult> => {
//     if (!checkAccount) {
//       try {
//         const resp = await fetch(`${API_BASE_URL}/api/User/check`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email, password }),
//         });

//         const body = await resp.json().catch(() => ({}));

//         if (!resp.ok) {
//           return { guest: null, error: body.error || body.message || 'Invalid credentials' };
//         }

//         const guest = body.guest; 
//         db.updateUser(guest);
//         setUser(guest);

//         return { guest, error: body.error || undefined };
//       } catch {
//         return { guest: null, error: 'Server error during login' };
//       }
//     }

//     const guestId = `guest-${crypto.randomUUID().slice(0, 8)}`;
//     const user_created = {
//       id: guestId,
//       user_id: guestId,
//       name: `guest_${guestId.slice(-4)}`,
//       email,
//       password,
//       avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${guestId}`,
//       credits: 0,
//     };

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/User/create`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_created }),
//       });

//       const body = await res.json().catch(() => ({}));
      
//       if (!res.ok) {
//         return { guest: null, error: body.error || body.message || 'The user already exists' };
//       }

//       const guest = body.guest; 
//       db.updateUser(guest);
//       setUser(guest);

//       return { guest, error: body.error || undefined };
//     } catch {
//       return { guest: null, error: 'Failed to create guest user' };
//     }
//   };

//   const refreshUser = useCallback(async () => {
//     if (!user?.user_id) return;

//     try {
//       setUser(user);
//     } catch (error) {
//       console.error('Failed to refresh user:', error);
//     }
//   }, [user?.user_id]);

//   const googleLogin = async () => {
//     const google = (window as any)?.google;
//     if (!isGoogleConfigured || !google?.accounts?.id) {
//       throw new Error('Google authentication is not available');
//     }

//     google.accounts.id.prompt();
//   };

//   const githublogin = async () => {
//     throw new Error('GitHub login is not implemented yet');
//   };

//   const logout = () => {
//     db.updateUser(null);
//     setUser(null);
//     navigate('/');
//   };

//   const handleUpdateCredits = (amount: number) => {
//     const newCredits = db.updateCredits(amount);
//     setUser(prev => prev ? { ...prev, credits: newCredits } : null);
//   };

//   const onUpdateUser = async (updatedUser: User) => {
//     try {
//       const payload = {
//         email: updatedUser.email,
//         UpdatedUser: {
//           name: updatedUser.name,
//           credits: updatedUser.credits,
//           avatar: updatedUser.avatar,
//           ...(updatedUser.password ? { password: updatedUser.password } : {}),
//         },
//       };

//       const resp = await fetch(`${API_BASE_URL}/api/User/update`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const body = await resp.json().catch(() => ({}));

//       if (!resp.ok) {
//         throw new Error(body.error || 'Failed to update user');
//       }

//       const nextUser = body.guest; //normalizeUser({ ...updatedUser, id: updatedUser.id || user?.id }, updatedUser.email);
//       setUser(nextUser);
//       db.updateUser(nextUser);
//     } catch (err) {
//       console.error('User update failed:', err);
//     }
//   };

//   const getProjects = async (user_id: string) => {
//     try {
//         const resp = await fetch(`${API_BASE_URL}/api/User/getProjects`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ user_id }),
//         });

//         const body = await resp.json().catch(() => ({}));

//         if (!resp.ok) {
//           return { guest: null, error: body.error || body.message || 'Invalid credentials' };
//         }
//         const projects = body.projects

//         return { projects, error: body.error || undefined };
//       } catch {
//         return { projects: null, error: 'Server error during login' };
//       }
//   };

//   return {
//     user,
//     onUpdateUser,
//     login,
//     getProjects,
//     refreshUser,
//     googleLogin,
//     githublogin,
//     setUser,
//     logout,
//     handleUpdateCredits,
//     isGoogleConfigured,
//     setIsGoogleConfigured,
//     handleCredentialResponse,
//     GOOGLE_CLIENT_ID,
//   };
// }

import { useState, useCallback, useEffect, useRef } from 'react';
import { db } from '../store/db';
import { User } from '../types/types';
import { parseJwt } from '../utils/functions';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/services/parameters';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

type LoginResult = {
  guest: User | null;
  error?: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();

  /*
   * Keep the current user ID in a ref so callbacks don't
   * unnecessarily depend on the entire user object.
   */
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = user?.user_id ?? null;
  }, [user?.user_id]);

  /*
   * ---------------------------------------------------------
   * Set user in one place
   * ---------------------------------------------------------
   */
  const updateLocalUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    db.updateUser(nextUser);

    userIdRef.current = nextUser?.user_id ?? null;
  }, []);

  /*
   * ---------------------------------------------------------
   * Fetch the latest user from the backend
   * ---------------------------------------------------------
   */
  const refreshUser = useCallback(async (): Promise<User | null> => {
    const userId = userIdRef.current;

    if (!userId) {
      return null;
    }

    try {
      setIsRefreshing(true);

      const response = await fetch(
        `${API_BASE_URL}/api/User/${encodeURIComponent(userId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body.error || body.message || 'Failed to refresh user'
        );
      }

      const freshUser: User = body.guest;

      updateLocalUser(freshUser);

      return freshUser;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * Initial user
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const persistedUser = db.getUser();

    if (persistedUser) {
      setUser(persistedUser);
      userIdRef.current = persistedUser.user_id;
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * Google login
   * ---------------------------------------------------------
   */
  const handleCredentialResponse = useCallback(
    async (response: any) => {
      const payload = parseJwt(response.credential);

      if (!payload) return;

      try {
        const resp = await fetch(`${API_BASE_URL}/api/User/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            google_id: payload.sub,
            name: payload.name,
            email: payload.email,
            avatar: payload.picture,
          }),
        });

        const body = await resp.json().catch(() => ({}));

        if (!resp.ok) {
          throw new Error(
            body.error || body.message || 'Google login failed'
          );
        }

        updateLocalUser(body.guest);
      } catch (error) {
        console.error('Google login failed:', error);
      }
    },
    [updateLocalUser]
  );

  /*
   * ---------------------------------------------------------
   * Google initialization
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const hasClientId =
      Boolean(GOOGLE_CLIENT_ID) &&
      !GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID');

    if (!hasClientId) return;

    const initializeGoogle = () => {
      const google = (window as any)?.google;

      if (!google?.accounts?.id) {
        return false;
      }

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      setIsGoogleConfigured(true);

      return true;
    };

    if (initializeGoogle()) return;

    const interval = window.setInterval(() => {
      if (initializeGoogle()) {
        window.clearInterval(interval);
      }
    }, 200);

    return () => window.clearInterval(interval);
  }, [handleCredentialResponse]);

  /*
   * ---------------------------------------------------------
   * Login
   * ---------------------------------------------------------
   */
  const login = async (email: string, password: string, checkAccount = false): Promise<LoginResult> => {
    if (!checkAccount) {
      try {
        const resp = await fetch(`${API_BASE_URL}/api/User/check`, {
          credentials: "include",    
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const body = await resp.json().catch(() => ({}));

        if (!resp.ok) {
          return { guest: null, error: body.error || body.message || 'Invalid credentials' };
        }

        const guest = body.guest; 
        updateLocalUser(guest);

        return { guest, error: body.error || undefined };
      } catch {
        return { guest: null, error: 'Server error during login' };
      }
    }

    const guestId = `guest-${crypto.randomUUID().slice(0, 8)}`;
    const user_created = {
      id: guestId,
      user_id: guestId,
      name: `guest_${guestId.slice(-4)}`,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${guestId}`,
      credits: 0,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/User/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_created }),
      });

      const body = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        return { guest: null, error: body.error || body.message || 'The user already exists' };
      }

      const guest = body.guest; 
      updateLocalUser(guest);

      return { guest, error: body.error || undefined };
    } catch {
      return { guest: null, error: 'Failed to create guest user' };
    }
  };
  /*
   * ---------------------------------------------------------
   * Update user
   * ---------------------------------------------------------
   */
  const onUpdateUser = useCallback(
    async (updatedUser: User) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/User/update`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              user_id: updatedUser.user_id,
              email: updatedUser.email,
              UpdatedUser: {
                name: updatedUser.name,
                credits: updatedUser.credits,
                avatar: updatedUser.avatar,
                ...(updatedUser.password
                  ? { password: updatedUser.password }
                  : {}),
              },
            }),
          }
        );

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            body.error || 'Failed to update user'
          );
        }

        /*
         * Prefer the server's representation of the user.
         */
        const serverUser: User = body.guest;

        updateLocalUser(serverUser);

        return serverUser;
      } catch (error) {
        console.error('User update failed:', error);
        throw error;
      }
    },
    [updateLocalUser]
  );

  /*
   * ---------------------------------------------------------
   * Credits
   * ---------------------------------------------------------
   */
  const handleUpdateCredits = useCallback(
    async (amount: number) => {
      /*
       * Ideally this should also go through your backend.
       * Do NOT rely on local db.updateCredits() for real credits.
       */
      await refreshUser();
    },
    [refreshUser]
  );

  /*
   * ---------------------------------------------------------
   * Projects
   * ---------------------------------------------------------
   */
  const getProjects = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/User/getProjects`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            user_id: userId,
          }),
        }
      );

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          projects: null,
          error:
            body.error ||
            body.message ||
            'Failed to get projects',
        };
      }

      return {
        projects: body.projects,
        error: body.error || undefined,
      };
    } catch (error) {
      console.error('Get projects failed:', error);

      return {
        projects: null,
        error: 'Server error while getting projects',
      };
    }
  }, []);

  /*
   * ---------------------------------------------------------
   * Google
   * ---------------------------------------------------------
   */
  const googleLogin = useCallback(async () => {
    const google = (window as any)?.google;

    if (!isGoogleConfigured || !google?.accounts?.id) {
      throw new Error(
        'Google authentication is not available'
      );
    }

    google.accounts.id.prompt();
  }, [isGoogleConfigured]);

  /*
   * ---------------------------------------------------------
   * Logout
   * ---------------------------------------------------------
   */
  // const logout = () => {
  //   db.updateUser(null);
  //   setUser(null);
  //   navigate('/');
  // };
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/User/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  return {
    user,
    isRefreshing,
    refreshUser,
    onUpdateUser,
    login,
    getProjects,
    googleLogin,
    setUser: updateLocalUser,
    logout,
    handleUpdateCredits,
    isGoogleConfigured,
    setIsGoogleConfigured,
    handleCredentialResponse,
    GOOGLE_CLIENT_ID,
  };
}