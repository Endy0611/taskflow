import React from "react";
import TemplateCard from "./TemplateCard";
import { NavLink } from "react-router-dom";

export default function TemplateSection({
  title,
  templates,
  viewMode = "grid",
}) {
  if (!templates || templates.length === 0) return null;

  return (
    <section className="mb-16">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {title}
      </h2>

      {/* Templates Container */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            : "flex flex-col gap-6"
        }
      >
        {templates.map((template) =>
          viewMode === "grid" ? (
            // Grid Card (TemplateCard should also support dark mode inside)
            <TemplateCard key={template.id} template={template} />
          ) : (
            // List Card
            <div
              key={template.id}
              className="group flex items-center gap-6 p-6 border rounded-2xl 
                         bg-gradient-to-r from-white to-gray-50 
                         dark:from-gray-800 dark:to-gray-900 dark:border-gray-700
                         shadow-sm hover:shadow-xl hover:scale-[1.02] 
                         transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail with Overlay */}
              <div className="relative">
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-40 h-28 object-cover rounded-xl shadow-md 
                             group-hover:shadow-xl transition-shadow duration-300"
                />
                <div
                  className="absolute inset-0 rounded-xl 
                             bg-gradient-to-t from-black/30 to-transparent 
                             opacity-0 group-hover:opacity-100 
                             transition-opacity duration-300"
                />
              </div>

              {/* Template Content */}
              <div className="flex-1 min-w-0">
                {/* Title + Featured */}
                <div className="flex items-center gap-3 mb-3">
                  <h3
                    className="text-lg font-semibold text-gray-900 dark:text-white 
                                 group-hover:text-primary transition-colors duration-300"
                  >
                    {template.title}
                  </h3>
                  {template.featured && (
                    <span
                      className="px-3 py-1 text-xs font-medium rounded-full 
                                     bg-blue-100 text-primary border border-blue-200
                                     dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800"
                    >
                      ✨ Featured
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Action Button */}
                <NavLink
                  to="/projectmanagement"
                  onClick={() => {
                    localStorage.setItem("selectedBackground", template.image);
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
             bg-primary rounded-lg shadow-md 
             hover:bg-primary/90 hover:shadow-lg hover:scale-105 
             transition-all duration-200"
                >
                  <span>Use Template</span>
                  <svg
                    className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </NavLink>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
