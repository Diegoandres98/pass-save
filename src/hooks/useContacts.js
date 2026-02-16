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

export function useContacts() {
  const { user } = useAuth();
  const { cryptoKey } = useVault();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const contactsRef = user
    ? collection(db, 'users', user.uid, 'contacts')
    : null;

  useEffect(() => {
    if (!contactsRef || !cryptoKey) {
      setContacts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(contactsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, async (snapshot) => {
      try {
        const decrypted = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name,
              category: data.category || 'otro',
              phone: await decrypt(data.phone, cryptoKey),
              email: data.email ? await decrypt(data.email, cryptoKey) : '',
              notes: data.notes ? await decrypt(data.notes, cryptoKey) : '',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          })
        );
        setContacts(decrypted);
      } catch (err) {
        console.error('Error decrypting contacts:', err);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    });
  }, [user?.uid, cryptoKey]);

  const addContact = async ({ name, phone, email, category, notes }) => {
    const encPhone = await encrypt(phone, cryptoKey);
    const doc = {
      name,
      category: category || 'otro',
      phone: encPhone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (email) doc.email = await encrypt(email, cryptoKey);
    if (notes) doc.notes = await encrypt(notes, cryptoKey);
    await addDoc(contactsRef, doc);
  };

  const updateContact = async (id, { name, phone, email, category, notes }) => {
    const encPhone = await encrypt(phone, cryptoKey);
    const data = {
      name,
      category: category || 'otro',
      phone: encPhone,
      email: email ? await encrypt(email, cryptoKey) : null,
      notes: notes ? await encrypt(notes, cryptoKey) : null,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(doc(contactsRef, id), data);
  };

  const removeContact = async (id) => {
    await deleteDoc(doc(contactsRef, id));
  };

  return { contacts, loading, addContact, updateContact, removeContact };
}
