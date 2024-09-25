import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

// Custom hook for authentication
export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log('got user: ', user);
      setUser(user);
    });
    return unsub;
  }, []);

  // Function to sign out the user
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null); // Update user state to null after successful sign out
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  return { user, signOut };
}
