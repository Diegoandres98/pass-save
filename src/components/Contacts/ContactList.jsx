import { useState } from 'react';
import { useContacts } from '../../hooks/useContacts';
import { CONTACT_CATEGORIES } from '../../lib/contactCategories';
import ContactCard from './ContactCard';
import ContactForm from './ContactForm';

export default function ContactList() {
  const { contacts, loading, addContact, updateContact, removeContact } =
    useContacts();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const filtered = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'todas' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async (form, id) => {
    if (id) {
      await updateContact(id, form);
    } else {
      await addContact(form);
    }
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este contacto?')) {
      await removeContact(id);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditEntry(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Cargando contactos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contactos..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors cursor-pointer flex-shrink-0"
        >
          + Agregar
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setCategoryFilter('todas')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
            categoryFilter === 'todas'
              ? 'bg-gray-700 text-white'
              : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          Todas
        </button>
        {CONTACT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-gray-700 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">📇</div>
          <p className="text-gray-400">
            {contacts.length === 0
              ? 'Aún no tienes contactos. ¡Agrega el primero!'
              : 'No se encontraron contactos.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <ContactCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ContactForm
          entry={editEntry}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
