import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../context/VaultContext';
import { encrypt, decrypt } from '../lib/crypto';

export function usePasswords() {
  const { user } = useAuth();
  const { cryptoKey } = useVault();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  const passwordsRef = user
    ? collection(db, 'users', user.uid, 'passwords')
    : null;

  useEffect(() => {
    if (!passwordsRef || !cryptoKey) {
      setPasswords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(passwordsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, async (snapshot) => {
      try {
        const decrypted = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              site: data.site,
              url: data.url,
              category: data.category || 'personal',
              username: await decrypt(data.username, cryptoKey),
              password: await decrypt(data.password, cryptoKey),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          })
        );
        setPasswords(decrypted);
      } catch (err) {
        console.error('Error decrypting passwords:', err);
        setPasswords([]);
      } finally {
        setLoading(false);
      }
    });
  }, [user?.uid, cryptoKey]);

  const addPassword = async ({ site, url, category, username, password }) => {
    const encUsername = await encrypt(username, cryptoKey);
    const encPassword = await encrypt(password, cryptoKey);
    await addDoc(passwordsRef, {
      site,
      url,
      category: category || 'personal',
      username: encUsername,
      password: encPassword,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updatePassword = async (id, { site, url, category, username, password }) => {
    const encUsername = await encrypt(username, cryptoKey);
    const encPassword = await encrypt(password, cryptoKey);
    await updateDoc(doc(passwordsRef, id), {
      site,
      url,
      category: category || 'personal',
      username: encUsername,
      password: encPassword,
      updatedAt: serverTimestamp(),
    });
  };

  const removePassword = async (id) => {
    await deleteDoc(doc(passwordsRef, id));
  };

  return { passwords, loading, addPassword, updatePassword, removePassword };
}
