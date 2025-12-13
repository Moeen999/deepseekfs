"use client";

import { assets } from "@/assets/assets";
import PromptArea from "@/components/PromptArea";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  return (
    <div>
      <div className="flex h-screen">
        <Sidebar expand={expand} setExpand={setExpand} />
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute flex items-center justify-between w-full px-4 top-6">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180"
              src={assets.menu_icon}
              alt="menuIcon"
            />
            <Image
              className="opacity-70"
              src={assets.chat_icon}
              alt="cahtIcon"
            />
          </div>
          {messages?.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image src={assets.logo_icon} alt="" className="h-16" />
                <p className="text-2xl font-medium">Hi, I'm DeepSeek.</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>
          ) : (
            <div></div>
          )}

          <PromptArea isLoading={isLoading} setIsloading={setIsloading} />

          <p className="text-xs absolute bottom-1 text-gray-500">
            AI generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
