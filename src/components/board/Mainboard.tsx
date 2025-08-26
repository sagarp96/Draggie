import Todo from "./Todo";
import InProgress from "./InProgress";
import Done from "./Done";
import Chat from "./Chat";

export default function Mainboard() {
  return (
    <div className="grid grid-cols-4 gap-4 p-10 border-solid border-2 h-screen w-full justify-center">
      <div className="border-solid border-2 text-center underline">
        <Todo />
      </div>
      <div className="border-solid border-2 text-center underline">
        <InProgress />
      </div>
      <div className="border-solid border-2 text-center underline">
        <Done />
      </div>
      <div className="border-solid border-2 text-center underline">
        <Chat />
      </div>
    </div>
  );
}
