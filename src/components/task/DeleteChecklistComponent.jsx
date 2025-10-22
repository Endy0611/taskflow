export function DeleteChecklistComponent({ onConfirm, onCancel }) {
  return (
    <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-lg text-center space-y-4">
      <h3 className="text-xl font-semibold">Are you sure to delete?</h3>
      <p className="text-gray-500 text-sm">
        Deleting a checklist — there’s no way to get it back.
      </p>

      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Delete checklist
        </button>
      </div>
    </div>
  );
}
