import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  open = true, // allow external control (optional)
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Dim background */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog box */}
          <motion.div
            className="relative bg-white dark:bg-gray-800 w-full max-w-sm rounded-xl shadow-lg p-6 z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Title */}
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           hover:bg-gray-100 dark:hover:bg-gray-700
                           text-gray-800 dark:text-gray-200 transition-colors duration-150"
              >
                {cancelText}
              </button>

              <button
                onClick={() => {
                  onConfirm?.();
                  onCancel?.(); // close automatically after confirm
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700
                           text-white font-medium shadow-sm transition-colors duration-150"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
