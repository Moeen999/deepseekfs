import { Webhook } from "svix";
import connectToDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const wh = new Webhook(process.env.SIGIN_SECRET);

  const headerPayload = await headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const { data, type } = wh.verify(body, svixHeaders);

  try {
    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      name: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    await connectToDB();

    if (type === "user.created") {
      await User.create(userData);
    }

    if (type === "user.updated") {
      await User.findByIdAndUpdate(data.id, userData);
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }
  } catch (error) {
    console.error("❌ DB error in webhook:", error  );
  }

  return NextResponse.json({ message: "Event Received" });
}
