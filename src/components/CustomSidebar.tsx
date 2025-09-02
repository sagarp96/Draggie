"use client";

import SidebarToggleBTN from "./Buttons/SidebarToggleBTN";
import dynamic from "next/dynamic";
import { useCurrentUserName } from "@/hooks/use-current-user-name";
import { useUserAuth } from "@/hooks/useAuth";

const RealtimeChat = dynamic(
  () => import("@/components/realtime-chat").then((m) => m.RealtimeChat),
  { ssr: false }
);
const RealtimeAvatarStack = dynamic(
  () =>
    import("@/components/realtime-avatar-stack").then(
      (m) => m.RealtimeAvatarStack
    ),
  { ssr: false }
);

export default function CustomSidebar({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  const { data: user } = useUserAuth();
  const username = useCurrentUserName();

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
        <header className="flex items-center flex-col gap-2 border-1 m-5 bg-black dark:bg-grey-800 rounded-full">
          <h1>Teammates-Online</h1>
          {user ? <RealtimeAvatarStack roomName="break_room" /> : null}
        </header>

        <div className="chat flex items-center flex-col gap-2 border-1 border-dotted m-5 rounded-2xl bg-black dark:bg-grey-800 h-180 lg:h-4/5 p-2">
          <h2>Chat</h2>
          {user ? (
            <RealtimeChat roomName="my-chat-room" username={username} />
          ) : (
            <div className="text-sm opacity-70">Log in to chat</div>
          )}
        </div>

        <footer className="p-4 border-t border-white/10 text-sm opacity-80"></footer>
      </aside>
    </>
  );
}
