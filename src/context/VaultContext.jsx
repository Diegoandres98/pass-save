import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { setupMasterPassword, unlockVault } from '../lib/crypto';
import { useAuth } from './AuthContext';

const VaultContext = createContext(null);

export function VaultProvider({ children }) {
  const { user } = useAuth();
  const [cryptoKey, setCryptoKey] = useState(null);
  const [hasMasterPassword, setHasMasterPassword] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCryptoKey(null);
      setHasMasterPassword(null);
      setLoading(false);
      return;
    }

    async function checkMasterPassword() {
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setHasMasterPassword(userDoc.exists() && !!userDoc.data().masterKey);
      } catch (err) {
        console.error('Error checking master password:', err);
        setHasMasterPassword(false);
      } finally {
        setLoading(false);
      }
    }

    checkMasterPassword();
  }, [user]);

  const createMasterPassword = async (password) => {
    const { key, masterKeyData } = await setupMasterPassword(password);
    await setDoc(doc(db, 'users', user.uid), { masterKey: masterKeyData });
    setHasMasterPassword(true);
    setCryptoKey(key);
  };

  const unlock = async (password) => {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const { masterKey } = userDoc.data();
    const key = await unlockVault(password, masterKey);
    setCryptoKey(key);
  };

  const lock = () => setCryptoKey(null);

  const isUnlocked = !!cryptoKey;

  return (
    <VaultContext.Provider
      value={{
        cryptoKey,
        hasMasterPassword,
        loading,
        isUnlocked,
        createMasterPassword,
        unlock,
        lock,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) throw new Error('useVault must be used within VaultProvider');
  return context;
}
