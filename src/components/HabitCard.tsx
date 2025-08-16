import { useState, useEffect, useRef } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import Achievements from "./Achievements";

interface HabitCardProps {
  id: number;
  name: string;
  lastReset?: string;
  history?: string[];
  onReset: () => void;
  onDelete: () => void;
}

const HabitCard = ({
  id,
  name,
  lastReset,
  history = [],
  onReset,
  onDelete,
}: HabitCardProps) => {
  const [timeElapsed, setTimeElapsed] = useState<string>("");
  const [showHistory, setShowHistory] = useState(false);

  // Format ms into "Xd Yh Zm Ss"
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // For achievements
  const currentStreakDays = lastReset
    ? Math.floor(
        (Date.now() - new Date(lastReset).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  // This hook manages the display of elapsed time since a habit was last reset
  useEffect(() => {
    if (!lastReset) {
      setTimeElapsed("Not started yet");
      return;
    }
    // This function updates the elapsed time
    const update = () => {
      const diff = Date.now() - new Date(lastReset).getTime();
      setTimeElapsed(formatDuration(diff));
    };

    update();
    // Set an interval to update the elapsed time every second
    const timer = setInterval(update, 1000);
    // Clear the interval on component unmount
    //  it prevents multiple timers from running simultaneously and avoids potential memory leaks or unwanted updates after the component is no longer in use
    return () => clearInterval(timer);
  }, [lastReset]);

  const popoverId = `popover-${id}`;

  const popoverRef = useRef<HTMLUListElement>(null);

  // This hook manages the display of the history popover
  useEffect(() => {
    const popoverElement = popoverRef.current;
    if (!popoverElement) return;

    const handleToggle = (e: any) => {
      if (e.newState === "closed") {
        setShowHistory(false);
      }
      if (e.newState === "open") {
        setShowHistory(true);
      }
    };

    popoverElement.addEventListener("toggle", handleToggle);

    return () => {
      popoverElement.removeEventListener("toggle", handleToggle);
    };
  }, [popoverRef]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHistory = history.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="card bg-base-200 shadow-md border border-neutral-content p-4 rounded-lg hover:shadow-lg transition-shadow duration-200 font-quattrocento">
      <h2 className="card-title text-2xl font-bold m-1">{name}</h2>
      <p className="text-secondary-content mx-1 my-2">⏱ {timeElapsed}</p>
      <Achievements currentStreakDays={currentStreakDays} />
      <div className="card-actions flex gap-2 mt-3">
        <button className="btn btn-primary btn-md" onClick={onReset}>
          Reset
        </button>
        <button className="btn btn-error btn-md" onClick={onDelete}>
          Delete
        </button>
        <button
          className="btn btn-secondary btn-md"
          popoverTarget={popoverId}
          style={{ ["anchorName" as any]: `--anchor-${id}` }}
        >
          {showHistory ? "Hide" : "View"} History
        </button>
      </div>
      <div>
        <ul
          ref={popoverRef}
          className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm text-base"
          popover="auto"
          id={popoverId}
          style={{ ["positionAnchor" as any]: `--anchor-${id}` }}
        >
          {currentHistory.length > 0 ? (
            <>
              {[...currentHistory]
                .slice()
                .reverse()
                .map((date, idx) => (
                  <li key={idx} className="text-center">
                    {new Date(date).toLocaleString()}
                  </li>
                ))}
              <div className="flex justify-center mt-2 join">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="join-item btn text-neutral rounded disabled:opacity-50"
                >
                  <FaLongArrowAltLeft size={24} />
                </button>
                <span className="px-4 py-1 text-neutral flex justify-center items-center text-center text-xs">
                  Page <br />
                  {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="join-item btn text-neutral rounded mr-2 disabled:opacity-50"
                >
                  <FaLongArrowAltRight size={24} />
                </button>
              </div>
            </>
          ) : (
            <li>No history available</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HabitCard;
