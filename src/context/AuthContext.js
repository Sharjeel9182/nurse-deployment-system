import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, fetchUserAttributes, signOut } from '@aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    // In Amplify v6, Hub.listen returns the cleanup function directly
    const removeListener = Hub.listen('auth', ({ payload }) => {
      const { event } = payload;
      switch (event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          break;
        default:
          break;
      }
    });

    // Call the cleanup function directly
    return () => removeListener();
  }, []);

  async function checkUser() {
    try {
      const authUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      setUser({ ...authUser, attributes: userAttributes });
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);