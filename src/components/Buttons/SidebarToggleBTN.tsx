import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
export default function SidebarToggleBTN({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      className="
        fixed right-0 top-1/2 -translate-y-1/2 z-[60]
        bg-black/80 hover:bg-black text-white
        w-10 h-12 flex items-center justify-center
        rounded-l-md shadow-lg outline-none
      "
    >
      <MdKeyboardDoubleArrowLeft
        size={24}
        className={`transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
        title={isOpen ? "Close Sidebar" : "Open Sidebar"}
      />
    </button>
  );
}
