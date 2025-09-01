import SidebarToggleBTN from "./Buttons/SidebarToggleBTN";
import { RealtimeChat } from "@/components/realtime-chat";
import { RealtimeAvatarStack } from "@/components/realtime-avatar-stack";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
export default function CustomSidebar({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <>
      <SidebarToggleBTN onClick={onClick} isOpen={isOpen} />

      <div
        onClick={onClick}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      />

      <aside
        className={`
          fixed right-0 top-0 z-50 h-screen
          w-full sm:w-2/3 lg:w-1/2
          bg-slate-900/95 text-white shadow-2xl border-l border-white/10
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <header className="flex items-center flex-col gap-2 border-1 m-5 bg-black dark:bg-emerald-900 rounded-full">
          <h1>Teammates-Online</h1>

          <RealtimeAvatarStack roomName="break_room" />
        </header>

        <div className=" chat flex items-center flex-col gap-2 border-1 m-5 bg-black dark:bg-emerald-900 h-4/5">
          <h2>Chat</h2>
          <RealtimeChat
            roomName="my-chat-room"
            username={useCurrentUserName()}
          />
        </div>

        <footer className="p-4 border-t border-white/10 text-sm opacity-80"></footer>
      </aside>
    </>
  );
}
