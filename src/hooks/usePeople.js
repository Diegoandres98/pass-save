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

export function usePeople() {
  const { user } = useAuth();
  const { cryptoKey } = useVault();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  const peopleRef = user
    ? collection(db, 'users', user.uid, 'people')
    : null;

  useEffect(() => {
    if (!peopleRef || !cryptoKey) {
      setPeople([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(peopleRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, async (snapshot) => {
      try {
        const decrypted = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            let fields = [];
            if (data.fields) {
              const fieldsJson = await decrypt(data.fields, cryptoKey);
              fields = JSON.parse(fieldsJson);
            }
            return {
              id: docSnap.id,
              name: data.name,
              nickname: data.nickname || '',
              fields,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            };
          })
        );
        setPeople(decrypted);
      } catch (err) {
        console.error('Error decrypting people:', err);
        setPeople([]);
      } finally {
        setLoading(false);
      }
    });
  }, [user?.uid, cryptoKey]);

  const addPerson = async ({ name, nickname, fields }) => {
    const encFields = await encrypt(JSON.stringify(fields || []), cryptoKey);
    const data = {
      name,
      nickname: nickname || '',
      fields: encFields,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await addDoc(peopleRef, data);
  };

  const updatePerson = async (id, { name, nickname, fields }) => {
    const encFields = await encrypt(JSON.stringify(fields || []), cryptoKey);
    const data = {
      name,
      nickname: nickname || '',
      fields: encFields,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(doc(peopleRef, id), data);
  };

  const removePerson = async (id) => {
    await deleteDoc(doc(peopleRef, id));
  };

  return { people, loading, addPerson, updatePerson, removePerson };
}
