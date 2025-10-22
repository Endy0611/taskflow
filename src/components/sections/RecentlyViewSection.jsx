// components/sections/RecentlyViewedSection.jsx
import { BoardPreviewCard } from "../cards/BoardPreviewCard";

export function RecentlyViewedSection({ boards = ["Boardup", "Boardup", "Create new board"] }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg sm:text-xl font-semibold mb-3">Recently viewed</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
        {boards.map((title, idx) => (
          <BoardPreviewCard
            key={idx}
            title={title}
            imageId={idx + 10}
            isCreateNew={title === "Create new board"}
          />
        ))}
      </div>
    </section>
  );
}