import React, { useEffect, useMemo, useState } from "react";
import { Menu, Plus, Ellipsis } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../../components/sidebar/Sidebar";
import TaskFlowChatbot from "../../components/chatbot/Chatbot";
import { ShareBoardComponent } from "../../components/task/ShareBoardComponent";
import TaskDetailComponent from "../../components/task/TaskDetailComponent";
import { useLocation, useParams } from "react-router-dom";
import { http } from "../../services/http";

import toast from "react-hot-toast";

/* ---------------- Helper: Resolve board ID ---------------- */
function getBoardId(params, location) {
  let id = params?.id || params?.board;
  if (!id) {
    const segs = location.pathname.split("/").filter(Boolean);
    const last = segs[segs.length - 1];
    if (/^\d+$/.test(last)) id = last;
  }
  if (!id) {
    const qs = new URLSearchParams(location.search);
    id = qs.get("board") || qs.get("id") || undefined;
  }
  if (!id) id = localStorage.getItem("currentBoardId") || undefined;
  if (id) localStorage.setItem("currentBoardId", String(id));
  return id;
}

/* ---------------- Main Component ---------------- */
export default function ProjectManagement() {
  const params = useParams();
  const location = useLocation();
  const boardId = useMemo(
    () => getBoardId(params, location),
    [params, location]
  );

  /* ===== States ===== */
  const [lists, setLists] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [activeListForCard, setActiveListForCard] = useState(null);
  const [newCardText, setNewCardText] = useState("");
  const [newListName, setNewListName] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("TaskFlow");
  const [boardName, setBoardName] = useState("Loading...");

  useEffect(() => {
    const fetchWorkspaceName = async () => {
      try {
        // extract workspaceId from URL if available
        const segs = location.pathname.split("/").filter(Boolean);
        const wsId = segs.find((s) => /^\d+$/.test(s));
        if (!wsId) return;

        const res = await http.get(`/workspaces/${wsId}`);
        const name =
          res?.data?.name || res?.name || res?.data?.title || "TaskFlow";
        setWorkspaceName(name);
      } catch (err) {
        console.warn("[Workspace Name] not found:", err);
      }
    };
    fetchWorkspaceName();
  }, [location.pathname]);

  useEffect(() => {
    const fetchBoardName = async () => {
      if (!boardId) return;
      try {
        const res = await http.get(`/boards/${boardId}`);
        const name = res?.data?.title || res?.title || res?.data?.name || res?.name || "Board";
        setBoardName(name);
        // console.log("✅ Board name fetched:", name, "Full response:", res);
      } catch (err) {
        console.error("❌ [Board Name] Error:", err);
        setBoardName("Board");
      }
    };
    fetchBoardName();
  }, [boardId]);

  /* ===== Random Background Logic (Per Board) ===== */
  useEffect(() => {
    if (!boardId) return;

    const selectedBg = localStorage.getItem("selectedBackground");
    if (selectedBg) {
      setBackgroundImage(selectedBg);
      localStorage.setItem(`boardBackground_${boardId}`, selectedBg);
      localStorage.removeItem("selectedBackground");
    } else {
      const savedBg = localStorage.getItem(`boardBackground_${boardId}`);
      if (savedBg) {
        setBackgroundImage(savedBg);
      } else {
        // Random nature backgrounds (no animals)
        const backgrounds = [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80", // Mountain
          "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80", // Sunset sky
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80", // Forest
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80", // Beach/Sea
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80", // Ocean
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80", // Lake/Nature
          "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80", // Meadow
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80", // Mountain lake
        ];
        const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
        setBackgroundImage(randomBg);
        localStorage.setItem(`boardBackground_${boardId}`, randomBg);
      }
    }
  }, [boardId]);

  /* ===== Fetch Cards & Tasks ===== */
  const fetchCards = async () => {
    if (!boardId) return console.warn("[ProjectManagement] No boardId found");

    try {
      setLoadingCards(true);
      const res = await http.get(`/boards/${boardId}/cards`);
      const apiCards =
        res?._embedded?.cards ||
        res?.data?._embedded?.cards ||
        res?.cards ||
        res?.data?.cards ||
        [];

      const cardWithTasks = await Promise.all(
        apiCards.map(async (card) => {
          const cardId =
            card?._links?.self?.href?.split("/cards/")[1] ||
            card?.id ||
            Math.random().toString(36).substring(2, 9);

          let tasks = [];
          try {
            const taskRes = await http.get(`/cards/${cardId}/tasks`);
            tasks =
              taskRes?._embedded?.tasks ||
              taskRes?.data?._embedded?.tasks ||
              taskRes?.tasks ||
              taskRes?.data?.tasks ||
              [];
          } catch {
            console.warn(`⚠️ No tasks for card ${cardId}`);
          }

          return {
            id: cardId,
            title: card.title || "Untitled",
            cards: tasks.map((t) => ({
              id:
                t?._links?.self?.href?.split("/tasks/")[1] ||
                t.id ||
                Math.random().toString(36).substring(2, 9),
              text: t.title || t.note || "Untitled Task",
              note: t.note || "",
            })),
            showMenu: false,
            isEditing: false,
          };
        })
      );

      setLists(cardWithTasks);
    } catch (e) {
      console.error("[fetchCards] ❌", e);
      alert("Error fetching cards. See console for details.");
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [boardId]);

  /* ===== Handle Adding a Task ===== */
  const handleAddCard = async (listId) => {
    if (!newCardText.trim()) return;

    try {
      const now = new Date().toISOString();
      const payload = {
        title: newCardText,
        note: newCardText,
        card: `/cards/${listId}`,
        startedAt: now,
        endedAt: now,
        position: 1,
      };

      const res = await http.post("/tasks", payload, {
        headers: { "Content-Type": "application/json" },
      });

      const href =
        res?.data?._links?.self?.href ||
        res?._links?.self?.href ||
        res?.headers?.location ||
        "";

      const taskId =
        href.split("/tasks/")[1]?.replace(/\/.*/, "") ||
        res?.data?.id ||
        res?.id ||
        Math.random().toString(36).substring(2, 9);

      const newTask = {
        id: taskId,
        text: res?.data?.title || newCardText,
        note: res?.data?.note || "",
      };

      setLists((prev) =>
        prev.map((l) =>
          l.id === listId ? { ...l, cards: [...l.cards, newTask] } : l
        )
      );

      setNewCardText("");
      setActiveListForCard(null);
    } catch (err) {
      console.error("[Add Task] ❌", err);
      alert("Error creating task. See console for details.");
    }
  };

  /* ===== Handle Create New Card ===== */
  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    if (!boardId) {
      alert("Board ID not found.");
      return;
    }

    try {
      const payload = {
        title: newListName,
        note: newListName,
        board: `/boards/${boardId}`,
        position: 1,
      };

      const res = await http.post("/cards", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // console.log("[CreateCard] ✅", res);
      setNewListName("");
      setShowAddList(false);
      fetchCards(); // refresh
    } catch (err) {
      console.error("[CreateCard] ❌", err);
      alert("Error creating card. See console.");
    }
  };

  /* ===== Drag & Drop ===== */
  const onDragStart = (e, fromListId, cardId) => {
    e.dataTransfer.setData("fromListId", fromListId);
    e.dataTransfer.setData("cardId", cardId);
  };
  const onDrop = (e, toListId) => {
    const fromListId = e.dataTransfer.getData("fromListId");
    const cardId = e.dataTransfer.getData("cardId");
    if (!fromListId || !cardId || fromListId === toListId) return;

    const newLists = [...lists];
    const fromList = newLists.find((l) => l.id === fromListId);
    const toList = newLists.find((l) => l.id === toListId);
    const cardIndex = fromList.cards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return;

    const [movedCard] = fromList.cards.splice(cardIndex, 1);
    toList.cards.push(movedCard);
    setLists(newLists);
  };

  /* ===== Sidebar Resize Reset ===== */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setSidebarOpen(false);
    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  /* ===== UI ===== */
  return (
    <div className="h-screen flex flex-col dark:bg-gray-900 dark:text-gray-100">
      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed top inset-0 bg-black/40 backdrop-blur-[1px] z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto relative"
          style={{
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute inset-0" />
          {/* Top Bar */}
          <div className="relative z-10 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
              <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                <b>{boardName}</b>
              </h1>

              <button
                onClick={() => setShowShare(true)}
                className="px-3 py-1 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
              >
                Share
              </button>
            </div>
          </div>

          {/* Hamburger for Mobile */}
          <div className="relative z-10 md:hidden flex justify-start px-6 mt-4 w-full">
            <button
              className="p-2 rounded-md bg-primary text-white hover:bg-blue-900 transition-colors"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Board Lists */}
          <div className="relative z-10 flex flex-wrap gap-4 p-6 justify-center md:justify-start md:gap-10">
            {lists.map((list) => (
              <div
                key={list.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, list.id)}
                className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-3 w-64 relative shadow-lg"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2 text-black dark:text-gray-100">
                  {list.isEditing ? (
                    <input
                      type="text"
                      value={list.title}
                      onChange={(e) =>
                        setLists((prev) =>
                          prev.map((l) =>
                            l.id === list.id
                              ? { ...l, title: e.target.value }
                              : l
                          )
                        )
                      }
                      onBlur={() =>
                        setLists((prev) =>
                          prev.map((l) =>
                            l.id === list.id ? { ...l, isEditing: false } : l
                          )
                        )
                      }
                      autoFocus
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm w-full"
                    />
                  ) : (
                    <h2 className="font-medium truncate">
                      {list.title}
                      {loadingCards && list.id === "list-1"
                        ? " (loading…)"
                        : ""}
                    </h2>
                  )}

                  <div className="relative">
                    <button
                      onClick={() =>
                        setLists((prev) =>
                          prev.map((l) =>
                            l.id === list.id
                              ? { ...l, showMenu: !l.showMenu }
                              : { ...l, showMenu: false }
                          )
                        )
                      }
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Ellipsis className="w-5 h-5" />
                    </button>

                    {list.showMenu && (
                      <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-700 rounded shadow-md z-10">
                        <button
                          onClick={() =>
                            setLists((prev) =>
                              prev.map((l) =>
                                l.id === list.id
                                  ? { ...l, isEditing: true, showMenu: false }
                                  : l
                              )
                            )
                          }
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await http.delete(`/cards/${list.id}`);
                              setLists((prev) =>
                                prev.filter((l) => l.id !== list.id)
                              );
                              toast.success("Card deleted successfully!");
                            } catch (error) {
                              console.error("❌ Failed to delete card:", error);
                              toast.error("Failed to delete card");
                            }
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {list.cards.length > 0 ? (
                    list.cards.map((card) => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, list.id, card.id)}
                        onClick={() => setSelectedCard(card)}
                        className="bg-white dark:bg-gray-700 rounded-md shadow px-3 py-2 text-sm whitespace-pre-line cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 active:cursor-grabbing dark:text-gray-100"
                      >
                        {card.text}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center italic py-1">
                      No tasks yet.
                    </p>
                  )}
                </div>

                {/* Inline Add Task */}
                {activeListForCard === list.id ? (
                  <div className="mt-2">
                    <textarea
                      value={newCardText}
                      onChange={(e) => setNewCardText(e.target.value)}
                      className="w-full focus:outline-none rounded px-2 py-1 text-sm mb-2 bg-white dark:bg-gray-700 dark:text-gray-100"
                      placeholder="Enter task title..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddCard(list.id)}
                        className="px-2 py-1 bg-green-700 text-white text-xs rounded"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setActiveListForCard(null);
                          setNewCardText("");
                        }}
                        className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-xs rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveListForCard(list.id)}
                    className="text-xs text-white mt-2 bg-primary p-2 rounded dark:bg-purple-600 dark:hover:bg-purple-700 w-full"
                  >
                    + Add Task
                  </button>
                )}
              </div>
            ))}

            {/* Add Card Column */}
            <div className="w-64">
              {showAddList ? (
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                  <p className="text-center text-black dark:text-gray-100 font-semibold pb-2">
                    Create Card
                  </p>
                  <input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Card name"
                    className="w-full border dark:border-gray-600 rounded px-2 py-1 mb-2 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateList}
                      className="px-2 py-1 bg-green-700 text-white text-xs rounded"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddList(false)}
                      className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-xs rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddList(true)}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-primary dark:text-white px-4 py-3 w-full rounded-lg flex items-center justify-center hover:bg-white/95 dark:hover:bg-gray-800/95 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Add Card</span>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Chatbot */}
      <img
        src="/assets/general/chatbot.png"
        alt="Our Chatbot"
        className="fixed bottom-6 right-6 w-16 h-16 sm:w-20 sm:h-20 z-40 rounded-full shadow-lg cursor-pointer bg-white"
        onClick={() => setShowChatbot(true)}
      />

      {/* Share Modal */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShare(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ShareBoardComponent onClose={() => setShowShare(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Task Detail Modal ===== */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <TaskDetailComponent
                card={selectedCard}
                onClose={() => setSelectedCard(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Chatbot Modal ===== */}
      <AnimatePresence>
        {showChatbot && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChatbot(false)}
            />
            <motion.div
              className="fixed bottom-24 right-8 z-50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TaskFlowChatbot onClose={() => setShowChatbot(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}