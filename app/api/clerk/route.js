import { Webhook } from "svix";
import connectToDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req) {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  const headerPayload = await headers();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };
  // ? getting payload and its verification
  const body = await req.text();
  const { data, type } = wh.verify(body, svixHeaders);
  //? user data preparation to store in DB
  const userData = {
    _id: data.id,
    email: data.email_addresses[0].email_address,
    name: `${data.first_name} ${data.last_name}`,
    image: data.image_url,
  };
  try {
    await connectToDB();
  } catch (error) {
    console.log("Error connecting to DB in Clerk Webhook", error);
  }
  switch (type) {
    case "user.created":
      await User.create(userData);
      break;

    case "user.updated":
      await User.findByIdAndUpdate(data.id, userData, { upsert: true });
      break;

    case "user.deleted":
      await User.findByIdAndDelete(data.id);
      break;
  }
  return NextRequest.json({ message: "Clerk Webhook received successfully" });
}
