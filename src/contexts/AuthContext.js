import React, { createContext, useState, useContext, useEffect } from 'react';
import { signUp, signIn, signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      setUser({
        ...currentUser,
        ...userAttributes
      });
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  }

  const handleSignUp = async (email, password, role) => {
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:role': role,
            name: email.split('@')[0],
            phone_number: '+1234567890'
          },
          autoSignIn: false
        }
      });

      return { isSignUpComplete, nextStep };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      // First check if there's already a signed in user
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          // If there's a current user, sign them out first
          await signOut();
        }
      } catch (error) {
        // No current user, proceed with sign in
      }

      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      if (isSignedIn) {
        const userAttributes = await fetchUserAttributes();
        setUser(userAttributes);
        return userAttributes;
      } else {
        throw new Error(`Next step: ${nextStep.signInStep}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 