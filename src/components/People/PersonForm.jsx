import { useState, useEffect } from 'react';

export default function PersonForm({ entry, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    fields: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setForm({
        name: entry.name || '',
        nickname: entry.nickname || '',
        fields: entry.fields?.length ? entry.fields.map((f) => ({ ...f })) : [],
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFieldChange = (index, prop, value) => {
    setForm((prev) => {
      const fields = [...prev.fields];
      fields[index] = { ...fields[index], [prop]: value };
      return { ...prev, fields };
    });
  };

  const addField = () => {
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { key: '', value: '' }],
    }));
  };

  const removeField = (index) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cleaned = {
        ...form,
        fields: form.fields.filter((f) => f.key.trim() !== ''),
      };
      await onSave(cleaned, entry?.id);
      onClose();
    } catch (err) {
      console.error('Error al guardar persona:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">
          {entry ? 'Editar persona' : 'Agregar persona'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="ej. Carlos López"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Apodo (opcional)
            </label>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="ej. Carlitos"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Datos</label>
              <button
                type="button"
                onClick={addField}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                + Agregar dato
              </button>
            </div>

            {form.fields.length === 0 && (
              <p className="text-gray-600 text-sm py-3 text-center border border-dashed border-gray-800 rounded-lg">
                Sin datos. Haz clic en "+ Agregar dato" para comenzar.
              </p>
            )}

            <div className="space-y-2">
              {form.fields.map((field, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={field.key}
                    onChange={(e) =>
                      handleFieldChange(index, 'key', e.target.value)
                    }
                    placeholder="Nombre del dato"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <input
                    value={field.value}
                    onChange={(e) =>
                      handleFieldChange(index, 'value', e.target.value)
                    }
                    placeholder="Valor"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex-shrink-0"
                    title="Eliminar campo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 text-gray-300 hover:bg-gray-700 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
