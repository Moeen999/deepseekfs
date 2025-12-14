import connectToDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function POST(req) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      toast.error("LogIn to create a chat!");
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }
    const chatData = {
      userId,
      messages: [],
      name: "New Chat",
    };
    await connectToDB();
    await Chat.create(chatData);
    return NextResponse.json({ success: true, message: "Chat created" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
