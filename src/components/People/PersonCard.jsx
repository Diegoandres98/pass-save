import { useState } from 'react';

export default function PersonCard({ entry, onEdit, onDelete }) {
  const [copied, setCopied] = useState(null);
  const [visibleFields, setVisibleFields] = useState({});

  const copyToClipboard = async (text, fieldKey) => {
    await navigator.clipboard.writeText(text);
    setCopied(fieldKey);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleFieldVisibility = (index) => {
    setVisibleFields((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">👤</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-white font-medium truncate">{entry.name}</h3>
              {entry.nickname && (
                <span className="text-gray-500 text-sm truncate">
                  ({entry.nickname})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(entry)}
                className="text-gray-500 hover:text-blue-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                title="Editar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                title="Eliminar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {entry.fields.length > 0 && (
            <div className="mt-3 space-y-2">
              {entry.fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm w-24 truncate flex-shrink-0">
                    {field.key}
                  </span>
                  <span className="text-gray-300 text-sm truncate flex-1 font-mono">
                    {visibleFields[index] ? field.value : '••••••••'}
                  </span>
                  <button
                    onClick={() => toggleFieldVisibility(index)}
                    className="text-gray-500 hover:text-white p-1 rounded transition-colors cursor-pointer text-xs flex-shrink-0"
                  >
                    {visibleFields[index] ? 'Ocultar' : 'Ver'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(field.value, `field-${index}`)}
                    className="text-gray-500 hover:text-white p-1 rounded transition-colors cursor-pointer text-xs flex-shrink-0"
                  >
                    {copied === `field-${index}` ? '✓' : 'Copiar'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {entry.fields.length === 0 && (
            <p className="text-gray-600 text-sm mt-2">Sin datos adicionales</p>
          )}
        </div>
      </div>
    </div>
  );
}
