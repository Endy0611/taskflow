import { useState, useEffect } from "react";
import { Search, Grid, List, SidebarOpen as SidebarIcon, Menu } from "lucide-react";
import TemplateSection from "../template/TemplateSection";
import { templates, categories } from "../../features/template/templatesData";
import { NavLink } from "react-router-dom";
// import Sidebar from "../../components/sidebar/Sidebar";

export default function TemplateUser() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [darkMode] = useState(false);
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // optional if Sidebar needs it

  // Sync dark mode with <html> tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Close sidebar automatically below lg
  // useEffect(() => {
  //   const mq = window.matchMedia("(min-width: 1024px)");
  //   const handleChange = (e) => {
  //     if (!e.matches) setSidebarOpen(false);
  //   };
  //   handleChange(mq);
  //   mq.addEventListener("change", handleChange);
  //   return () => mq.removeEventListener("change", handleChange);
  // }, []);

  const categoryData = [
    { id: "All", name: "All", count: templates.length, color: "bg-blue-500" },
    {
      id: "Featured",
      name: "Featured",
      count: templates.filter((t) => t.category === "Featured").length,
      color: "bg-yellow-500",
    },
    {
      id: "Design",
      name: "Design",
      count: templates.filter((t) => t.category === "Design").length,
      color: "bg-pink-500",
    },
    {
      id: "Education",
      name: "Education",
      count: templates.filter((t) => t.category === "Education").length,
      color: "bg-green-500",
    },
    {
      id: "Marketing",
      name: "Marketing",
      count: templates.filter((t) => t.category === "Marketing").length,
      color: "bg-purple-500",
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredTemplatesByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredTemplates.filter((t) => t.category === category);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Overlay for mobile */}
      {/* {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )} */}

      {/* Sidebar */}
      {/* <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowModal={setShowModal}
      /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-16">
        {/* Hamburger (Mobile) */}
        {/* <button
            className="lg:hidden p-2 mb-4 rounded-md bg-primary text-white "
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <Menu className="w-5 h-5" />
          </button> */}

        {/* ===== Header ===== */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-primary bg-clip-text text-transparent">
            All Templates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center">
            Browse all available templates
          </p>
        </div>

        {/* ===== Search + Controls ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-8 transition-colors">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 dark:border-gray-600 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                placeholder-gray-400 dark:placeholder-gray-400
                transition-all duration-200"
            />
          </div>

          {/* ===== Category Pills ===== */}
          <div className="flex overflow-x-auto scrollbar-hide gap-3 mb-6 pb-2">
            {categoryData.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 group relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-lg transform scale-105"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600 hover:scale-105"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${category.color} ${
                      selectedCategory === category.id ? "bg-white" : ""
                    }`}
                  ></div>
                  <span>{category.name}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      selectedCategory === category.id
                        ? "bg-primary/70 text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {category.count}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* ===== Controls Row ===== */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {filteredTemplates.length} templates
            </span>

            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ===== Template Sections ===== */}
        {selectedCategory === "All" ? (
          categories.map((category) => {
            const categoryTemplates = filteredTemplatesByCategory[category];
            if (categoryTemplates.length === 0) return null;
            return (
              <TemplateSection
                key={category}
                title={category}
                templates={categoryTemplates}
                viewMode={viewMode}
              />
            );
          })
        ) : (
          <TemplateSection
            title={selectedCategory}
            templates={filteredTemplatesByCategory[selectedCategory]}
            viewMode={viewMode}
          />
        )}

        {/* ===== Empty State ===== */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No templates found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        )}
      </div>

      {/* ✅ Back to Board button
      <div className="fixed bottom-6 left-6 z-10">
        <NavLink
          to="/board"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white hover:bg-primary-hover hover:!text-white"
        >
          ← Back to Board
        </NavLink>
      </div> */}
    </div>
  );
}
