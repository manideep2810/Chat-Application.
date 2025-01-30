import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSiginingUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isCheckingAuth : true,
    onlineUsers : [],
    socket : null,

    checkAuth : async() => {
      try {
        const res = await axiosInstance("/auth/check");
        // console.log("result after chcking user",res);
        set({authUser : res.data});
        get().connectSocket();
      } catch (error) {
        console.log({authUser : error.data});
        set({authUser : null});
      } finally {
        set({isCheckingAuth : false});
      }
    },

    signup : async(data) => {
      set({isSiginingUp : true});
      try{          
        const res = await axiosInstance.post("/auth/signup",data);
        set({authUser : res.data});
        toast.success("Account created successfully");
        get().connectSocket();
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        set({isSiginingUp : false});
      }
    },

    logout : async() => {
      try {
        await axiosInstance.post("/auth/logout");
        set({authUser : null});
        toast.success("Logged out Succesfully");
        get().disconnectSocket();
      } catch(err) {
        toast.error(err.response.data.message);
      }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.message);
        } finally {
          set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        // console.log("I am inside update profile in authstore");
        console.log(data);
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io("http://localhost:5001", {
          query: {
            userId: authUser.id,
          },
        });
        socket.connect();
    
        set({ socket: socket });
        
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
       
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },      
}));