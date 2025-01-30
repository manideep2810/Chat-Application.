import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    function checkInclude(e){
        for(var i = 0 ; i < onlineUsers.length ; i++){
            if(onlineUsers[i]==e){
                // console.log(e,"true");
                return true;
            }
        }
        // console.log(e,"false");
        return false;
    }

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilepic || "/avatar.png"} alt={selectedUser.fullname} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullname}</h3>
                        <p className="text-sm text-base-content/70">
                            {checkInclude(selectedUser.id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedUser(null)} className="ml-auto">
                    <X />
                </button>
            </div>

        </div>
    );
};
export default ChatHeader;