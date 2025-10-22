import { X } from 'lucide-react'

export function AddCardComponent() {
  return (
    <div className="bg-highlight w-full max-w-xs p-4 rounded-lg space-y-3 relative">
      <input
        type="text"
        placeholder="Enter a title"
        className="w-full focus:outline-none bg-white px-3 py-2 rounded-md"
      />
      <div className="flex justify-between items-center">
        <button className="bg-primary text-white px-4 py-2 rounded-md">Add card</button>
        <button className="text-gray-500 hover:text-gray-800">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
