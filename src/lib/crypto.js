const PBKDF2_ITERATIONS = 600_000;

function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getKeyMaterial(password) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveKey',
  ]);
}

export async function deriveKey(password, salt) {
  const keyMaterial = await getKeyMaterial(password);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(text, key) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(text)
  );
  return {
    iv: bufferToBase64(iv),
    data: bufferToBase64(ciphertext),
  };
}

export async function decrypt(encryptedObj, key) {
  const iv = new Uint8Array(base64ToBuffer(encryptedObj.iv));
  const data = base64ToBuffer(encryptedObj.data);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  return new TextDecoder().decode(decrypted);
}

export async function setupMasterPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const key = await deriveKey(password, salt);

  const verifierPlain = 'pass-save-verifier';
  const encrypted = await encrypt(verifierPlain, key);

  return {
    key,
    masterKeyData: {
      salt: bufferToBase64(salt),
      verifier: encrypted,
    },
  };
}

export async function unlockVault(password, masterKeyData) {
  const salt = new Uint8Array(base64ToBuffer(masterKeyData.salt));
  const key = await deriveKey(password, salt);

  try {
    const decrypted = await decrypt(masterKeyData.verifier, key);
    if (decrypted !== 'pass-save-verifier') {
      throw new Error('Invalid master password');
    }
    return key;
  } catch {
    throw new Error('Invalid master password');
  }
}
