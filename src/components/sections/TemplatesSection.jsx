// components/sections/TemplatesSection.jsx
import { TemplateCard } from "../cards/TemplateCard";

export function TemplatesSection({ templates = ["Kanban Templates", "Kanban Templates", "Kanban Templates"] }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-3">
        Start with a template and let TaskFlow handle the rest with customizable workflows
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((title, idx) => (
          <TemplateCard key={idx} title={title} imageId={idx + 1} />
        ))}
      </div>
    </section>
  );
}