export const CATEGORIES = [
  { id: 'personal', label: 'Personal', color: 'bg-blue-500' },
  { id: 'trabajo', label: 'Trabajo', color: 'bg-amber-500' },
];

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: 'bg-gray-500' };
}
