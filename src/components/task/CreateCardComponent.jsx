import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { http } from "../../services/http";
import { useLocation, useParams } from "react-router-dom";

/** inline helper: resolve board id from params, path, query, or localStorage */
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

export default function CreateCardComponent({ onClose, onSuccess }) {
  const params = useParams();
  const location = useLocation();
  const boardId = useMemo(() => getBoardId(params, location), [params, location]);

  const [cardText, setCardText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("[CreateCard] boardId =", boardId);
  }, [boardId]);

  const handleCreateCard = async () => {
    if (!cardText.trim()) return;
    if (!boardId) {
      alert("Board ID not found in URL. Open /projectmanagement/<boardId>.");
      return;
    }

    const payload = {
      title: cardText,
      note: cardText,
      board: `/boards/${boardId}`,
      position: 1,
    };

    try {
      setLoading(true);
      console.log("[CreateCard] POST /cards →", payload);
      const res = await http.post("/cards", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("[CreateCard] ✅ created:", res);
      onSuccess?.(); // refresh parent
      onClose?.();
    } catch (err) {
      console.error("[CreateCard] ❌ error:", err?.response || err);
      alert("Error creating card — see console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-96 p-4">
      <div className="relative flex justify-center items-center">
        <h2 className="text-lg font-semibold">Create Card</h2>
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>
      </div>

      <textarea
        placeholder="Enter card details..."
        className="w-full h-24 border rounded-md p-2 focus:outline-none mt-4"
        value={cardText}
        onChange={(e) => setCardText(e.target.value)}
      />

      <button
        onClick={handleCreateCard}
        disabled={loading}
        className={`w-full rounded-md py-2 mt-3 text-white ${
          loading ? "bg-gray-400" : "bg-primary hover:bg-blue-700"
        }`}
      >
        {loading ? "Creating..." : "Create Card"}
      </button>
    </div>
  );
}
