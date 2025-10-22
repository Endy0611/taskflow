import React from "react";
import { motion } from "framer-motion";
import "../../index.css";
import { NavLink } from "react-router-dom";

export default function TemplateCard({ template }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                 overflow-hidden hover:shadow-md dark:hover:shadow-lg 
                 transition-shadow duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-50 object-cover justify-items-center"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {template.title}
          </h3>
          <span
            className="px-2 py-1 text-xs font-medium text-primary 
                           bg-blue-50 dark:bg-blue-800 dark:!text-blue-100 
                           rounded-full"
          >
            {template.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
          {template.description}
        </p>

        <NavLink
          to="/projectmanagement"
          onClick={() => {
            // Save selected template background image to localStorage
            localStorage.setItem("selectedBackground", template.image);
          }}
          className="text-center mt-4 w-full px-4 py-2 text-sm font-medium text-white 
             bg-primary dark:bg-blue-900/40 dark:hover:bg-blue-800 
             rounded-lg transition-colors duration-200"
        >
          Use Template
        </NavLink>
      </div>
    </motion.div>
  );
}
