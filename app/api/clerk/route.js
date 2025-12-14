export const runtime = "nodejs";

import { Webhook } from "svix";
import connectToDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  const headerPayload = headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };

  const body = await req.text();

  let event;
  try {
    event = wh.verify(body, svixHeaders);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { data, type } = event;

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
    await User.findByIdAndUpdate(data.id, userData, { upsert: true });
  }

  if (type === "user.deleted") {
    await User.findByIdAndDelete(data.id);
  }

  return NextResponse.json({ ok: true });
}
