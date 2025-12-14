import connectToDB from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { userId } = await getAuth(req);
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }
    await connectToDB();
    const chats = await Chat.find({ userId });
    return NextResponse.json({ success: true, chats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
