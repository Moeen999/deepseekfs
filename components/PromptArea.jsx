"use client";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PromptArea = ({ isLoading, setIsloading }) => {
  const [prompt, setPrompt] = useState("");
  const {
    user,
    chats,
    setChats,
    selectedChats,
    setSelectedChat,
    fetchUsersChats,
    createNewChat,
  } = useAppContext();

  const handleKeyDown =(e)=>{
    if(e.key==='Enter' && !e.shiftKey){
      e.preventDefault();
      handleSubmitFormPrompt(e);
    }
  }

  const handleSubmitFormPrompt = async (e) => {
    try {
      e.preventDefault();
      if (!user) return toast.error("Please sign in to continue");
      if (isLoading) toast.error("Please wait for the current response");
      setIsloading(true);
      setPrompt("");
      const userPrompt = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChats._id
            ? {
                ...chat,
                messages: [...chat.messages, userPrompt],
              }
            : chat
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt],
      }));
      const { data } = await axios.post("api/chat/ai", {
        chatId: selectedChats._id,
        prompt,
      });
      if (data.success) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChats._id
              ? { ...chat, messages: [chat.messages, data.data] }
              : chat
          )
        );

        const message = data.data.content;
        const msgToknes = message.split(" ");
        let aiMessages={
          role:"assistant",
          content:'',
          timestamp:Date.now()
        }
        setSelectedChat((prevData)=>({
          ...prevData,
          messages:[...prevData.messages,aiMessages]
        }));

        for (let i = 0; i < msgToknes.length; i++) {

          setTimeout(() => {
            aiMessages.content = msgToknes.slice(0, i + 1).join(" ");
            setSelectedChat((prev)=>{
              const updatedMessages = [...prev.messages.slice(0, -1), aiMessages];
              return {
                ...prev,
                messages: updatedMessages
              };
            })
          }, i * 100);
        }

      } else {
        toast.error(data?.message);
        setPrompt(prompt);
      }
    } catch (error) {
              toast.error(data.message);
        setPrompt(prompt);
    }finally{
      setIsloading(false);
    }

  };
  return (
    <form onSubmit={handleSubmitFormPrompt}
      className={`w-full ${
        false ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
        rows={2}
        required
        placeholder="Your prompt here..."
        className="outline-none w-full overflow-hidden resize-none wrap-break-words bg-transparent"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.deepthink_icon} alt="" className="h-5 " />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image src={assets.search_icon} alt="" className="h-5" />
            Search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image src={assets.pin_icon} alt="" className="w-4 cursor-pointer" />
          <button
            type="submit"
            disabled={!prompt ? true : false}
            className={`${
              prompt
                ? "bg-primary cursor-pointer"
                : "bg-[#71717a] cursor-not-allowed"
            } rounded-full p-2`}
          >
            <Image
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
              className="w-3.5 aspect-square"
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptArea