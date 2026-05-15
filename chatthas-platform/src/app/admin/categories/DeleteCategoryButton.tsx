'use client';

import { FaTrash } from 'react-icons/fa';
import { deleteCategory } from './actions';

export default function DeleteCategoryButton({ id }: { id: string }) {
  return (
    <button 
      onClick={async () => {
        if (confirm('Are you sure you want to delete this category?')) {
          await deleteCategory(id);
        }
      }}
      className="text-cream/20 hover:text-ember-400 transition-colors"
    >
      <FaTrash size={14} />
    </button>
  );
}
