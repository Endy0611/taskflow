// // src/pages/user/BoardB4Create.jsx
// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import SidebarB4CreateBoard from "../../components/sidebar/SidebarB4CreateBoard";
// import { NavLink, useNavigate } from "react-router-dom";
// import TaskFlowChatbot from "../../components/chatbot/Chatbot";
// import { Menu } from "lucide-react";
// import { http } from "../../services/http.js";
// import { CreateBoardComponent } from "../../components/task/CreateBoardComponent";

// const THEME_OPTIONS = ["ANGKOR", "BAYON", "BOKOR", "KIRIROM", "KOH_KONG"];

// export default function BoardB4Create() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [showWorkspaceModal, setShowModal] = useState(false);
//   const [showChatbot, setShowChatbot] = useState(false);
//   const [showCreateBoard, setShowCreateBoard] = useState(false);

//   // Form (name + theme)
//   const [workspaceName, setWorkspaceName] = useState("");
//   const [workspaceTheme, setWorkspaceTheme] = useState("ANGKOR");

//   const [loadingCreate, setLoadingCreate] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);

//   // Workspaces list
//   const [workspaces, setWorkspaces] = useState([]);
//   const [loadingList, setLoadingList] = useState(true);

//   const navigate = useNavigate();

//   // Load workspaces with paging endpoint first; fallback to plain GET
//   async function loadWorkspaces() {
//     setLoadingList(true);
//     setError(null);
//     try {
//       const data = await http(
//         "/workspaces/findAllWithSortAndPaging?page=0&size=12&sort=createdAt,desc",
//         { method: "GET" }
//       );
//       const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
//       setWorkspaces(list);
//     } catch {
//       try {
//         const alt = await http("/workspaces", { method: "GET" });
//         const list = Array.isArray(alt?.content) ? alt.content : Array.isArray(alt) ? alt : [];
//         setWorkspaces(list);
//       } catch (e) {
//         setError(e?.message || "Failed to load workspaces.");
//       }
//     } finally {
//       setLoadingList(false);
//     }
//   }

//   useEffect(() => {
//     loadWorkspaces();
//   }, []);

//   // Create workspace -> { name, theme }
//   const handleCreateWorkspace = async (e) => {
//     e?.preventDefault?.();
//     setError(null);
//     setMessage(null);

//     const name = workspaceName.trim();
//     if (!name) {
//       setError("Workspace name is required.");
//       return;
//     }
//     const theme = (workspaceTheme || "").trim() || "ANGKOR";

//     setLoadingCreate(true);
//     try {
//       const data = await http("/workspaces", {
//         method: "POST",
//         body: { name, theme },
//       });

//       // Extract ID (HATEOAS-friendly)
//       let workspaceId =
//         data?.id ||
//         data?.workspaceId ||
//         (() => {
//           const href = data?._links?.self?.href || data?.links?.self?.href || "";
//           if (!href) return null;
//           try {
//             const url = new URL(href, window.location.origin);
//             const segs = url.pathname.split("/").filter(Boolean);
//             return segs[segs.length - 1] || null;
//           } catch {
//             const segs = href.split("/").filter(Boolean);
//             return segs[segs.length - 1] || null;
//           }
//         })();

//       // Normalize for UI
//       const normalized = {
//         id: workspaceId ?? data?.id ?? Math.random().toString(36).slice(2),
//         name: data?.name || name,
//         theme: data?.theme || theme,
//         ...data,
//       };

//       // Update UI list immediately
//       setWorkspaces((prev) => [normalized, ...prev]);

//       // Save for the Board page and other screens
//       if (workspaceId) {
//         localStorage.setItem("current_workspace_id", String(workspaceId));
//       }
//       localStorage.setItem("last_workspace", JSON.stringify(normalized));

//       setMessage("Workspace created successfully!");
//       setWorkspaceName("");
//       setWorkspaceTheme("ANGKOR");
//       setShowModal(false);

//       // Go to board page
//       navigate(workspaceId ? `/board/${workspaceId}` : `/workspaceboard`);
//     } catch (err) {
//       setError(err?.message || "Failed to create workspace.");
//       console.error("Create workspace error:", err);
//     } finally {
//       setLoadingCreate(false);
//     }
//   };

//   return (
//     <div className="min-h-[93.5vh] flex flex-col dark:bg-gray-900 dark:text-white">
//       <div className="flex flex-1 overflow-hidden relative">
//         {/* Mobile overlay */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30 lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* Sidebar */}
//         <SidebarB4CreateBoard
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//           setShowModal={setShowModal}
//         />

//         {/* Main */}
//         <main className="relative flex-1 overflow-y-auto px-3 sm:px-6 lg:px-10 pt-5 sm:pt-8 lg:pt-10 bg-gray-100 dark:bg-gray-950 transition-all duration-300 ease-in-out">
//           {/* Hamburger (mobile) */}
//           <button
//             className="lg:hidden p-2 mb-4 rounded-md bg-blue-600 text-white"
//             aria-label="Toggle sidebar"
//             onClick={() => setSidebarOpen((v) => !v)}
//           >
//             <Menu className="w-5 h-5" />
//           </button>

//           {/* Templates */}
//           <section className="mb-10">
//             <h2 className="text-lg md:text-xl font-semibold mb-4">
//               Start with a template and let TaskFlow handle the rest
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//               {["Kanban", "Sprint Board", "Bug Tracker"].map((title, idx) => (
//                 <div key={idx} className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer">
//                   <img
//                     src={`https://picsum.photos/600/400?random=${idx + 1}`}
//                     alt={title}
//                     className="w-full h-40 md:h-44 lg:h-48 object-cover group-hover:scale-105 transition-transform"
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-3 py-2">
//                     {title} Templates
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Recently viewed (static) */}
//           <section className="mb-10">
//             <h2 className="text-lg md:text-xl font-semibold mb-4">Recently viewed</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
//               {["Boardup", "Boardup 2"].map((title, idx) => (
//                 <NavLink
//                   key={idx}
//                   to="/projectmanagement"
//                   className="relative rounded-xl overflow-hidden shadow-md border cursor-pointer"
//                 >
//                   <img
//                     src={`https://picsum.photos/600/400?random=${idx + 10}`}
//                     alt={title}
//                     className="w-full h-36 md:h-44 lg:h-48 object-cover"
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-3 py-1">
//                     {title}
//                   </div>
//                 </NavLink>
//               ))}

//               {/* Create board entry */}
//               <div
//                 onClick={() => setShowCreateBoard(true)}
//                 className="relative rounded-xl overflow-hidden shadow-md border bg-gray-200 dark:bg-gray-800 flex items-center justify-center cursor-pointer"
//               >
//                 <span className="text-gray-600 dark:text-gray-300 font-medium text-sm md:text-base">
//                   + Create new board
//                 </span>
//               </div>
//             </div>
//           </section>

//           {/* Your Workspaces (real data) */}
//           <section className="mb-20">
//             <h2 className="text-lg md:text-xl font-semibold mb-4">Your Workspaces</h2>

//             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
//               {/* Header */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-md font-bold">
//                     W
//                   </div>
//                   <span className="font-semibold text-base sm:text-lg">Workspaces</span>
//                 </div>
//                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 flex-nowrap">
//                   {["Boards", "Member", "Setting", "Update"].map((item, i) => (
//                     <NavLink
//                       key={i}
//                       to={`/workspace${item.toLowerCase()}`}
//                       className="flex-shrink-0 px-3 py-1.5 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 whitespace-nowrap"
//                     >
//                       {item}
//                     </NavLink>
//                   ))}
//                 </div>
//               </div>

//               {/* List */}
//               {loadingList ? (
//                 <div className="text-sm text-gray-500">Loading…</div>
//               ) : workspaces.length === 0 ? (
//                 <div className="text-sm text-gray-500">No workspaces yet. Create one!</div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//                   {workspaces.map((ws) => (
//                     <div
//                       key={ws.id ?? ws.workspaceId ?? ws.name}
//                       className="relative rounded-xl overflow-hidden shadow-md border bg-white dark:bg-gray-900"
//                     >
//                       <img
//                         src={`https://picsum.photos/seed/${ws.id || ws.name}/600/400`}
//                         alt={ws.name}
//                         className="w-full h-36 md:h-44 lg:h-48 object-cover"
//                       />
//                       <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-3 py-1 flex justify-between">
//                         <span>{ws.name || "Workspace"}</span>
//                         {ws.theme ? <span className="opacity-80">· {ws.theme}</span> : null}
//                       </div>
//                       <button
//                         className="absolute inset-0"
//                         onClick={() => navigate(`/board/${ws.id ?? ws.workspaceId ?? ""}`)}
//                         aria-label={`Open ${ws.name}`}
//                       />
//                     </div>
//                   ))}

//                   {/* Create new card */}
//                   <div
//                     onClick={() => setShowModal(true)}
//                     className="relative rounded-xl overflow-hidden shadow-md border bg-gray-200 dark:bg-gray-800 flex items-center justify-center cursor-pointer"
//                   >
//                     <span className="text-gray-600 dark:text-gray-300 font-medium text-sm md:text-base">
//                       + Create a Workspace
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* Chatbot button */}
//           <img
//             src="/src/assets/general/chatbot.png"
//             alt="Chatbot"
//             className="fixed bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 z-40 rounded-full shadow-lg cursor-pointer bg-white dark:bg-gray-700"
//             onClick={() => setShowChatbot(true)}
//           />
//         </main>
//       </div>

//       {/* Chatbot Modal */}
//       <AnimatePresence>
//         {showChatbot && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 z-40"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowChatbot(false)}
//             />
//             <motion.div
//               className="fixed bottom-20 right-4 sm:right-6 lg:right-10 z-50 w-[90vw] sm:w-[360px] md:w-[400px]"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <TaskFlowChatbot onClose={() => setShowChatbot(false)} />
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

    //   {/* Create Workspace Modal */}
    //   <AnimatePresence>
    //     {showWorkspaceModal && (
    //       <>
    //         <motion.div
    //           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    //           initial={{ opacity: 0 }}
    //           animate={{ opacity: 1 }}
    //           exit={{ opacity: 0 }}
    //           onClick={() => setShowModal(false)}
    //         />
    //         <motion.div
    //           className="fixed inset-0 flex items-center justify-center z-50 px-4"
    //           initial={{ scale: 0.8, opacity: 0 }}
    //           animate={{ scale: 1, opacity: 1 }}
    //           exit={{ scale: 0.8, opacity: 0 }}
    //           transition={{ duration: 0.2 }}
    //         >
    //           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg w-full p-6 md:p-8 relative">
    //             <h2 className="text-lg sm:text-xl font-bold mb-2">Let's build a Workspace</h2>
    //             <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
    //               Boost your productivity by grouping boards in one place.
    //             </p>

    //             <form onSubmit={handleCreateWorkspace}>
    //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    //                 Workspace name
    //               </label>
    //               <input
    //                 type="text"
    //                 placeholder="e.g. Marketing Team"
    //                 value={workspaceName}
    //                 onChange={(e) => setWorkspaceName(e.target.value)}
    //                 className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-4 bg-white dark:bg-gray-700 dark:text-white"
    //                 required
    //               />

    //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    //                 Theme
    //               </label>
    //               <select
    //                 value={workspaceTheme}
    //                 onChange={(e) => setWorkspaceTheme(e.target.value)}
    //                 className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white"
    //               >
    //                 {THEME_OPTIONS.map((t) => (
    //                   <option key={t} value={t}>
    //                     {t}
    //                   </option>
    //                 ))}
    //               </select>

    //               {error && <div className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</div>}
    //               {message && <div className="text-sm text-green-600 dark:text-green-400 mt-3">{message}</div>}

    //               <button
    //                 type="submit"
    //                 disabled={loadingCreate}
    //                 className="mt-4 block w-full text-center bg-blue-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    //               >
    //                 {loadingCreate ? "Creating..." : "Continue"}
    //               </button>
    //             </form>

    //             <button
    //               className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
    //               onClick={() => setShowModal(false)}
    //             >
    //               ✖
    //             </button>
    //           </div>
    //         </motion.div>
    //       </>
    //     )}
    //   </AnimatePresence>

//       {/* Create Board Modal */}
//       <AnimatePresence>
//         {showCreateBoard && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowCreateBoard(false)}
//             />
//             <motion.div
//               className="fixed inset-0 flex items-center justify-center z-50 px-4"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <CreateBoardComponent onClose={() => setShowCreateBoard(false)} />
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
