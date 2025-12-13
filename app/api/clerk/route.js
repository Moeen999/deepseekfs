import { Webhook } from "svix";
import connectToDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";

export async function POST(req){
    const wh = new Webhook(process.env.SIGNIN_SECRET);
    const headerPayload = await headers();
    const svixHeaders={
        "svix-id":headerPayload.get("svix-id"),
        "svix-timestamp":headerPayload.get("svix-timestamp"),
        "svix-signature":headerPayload.get("svix-signature"),
    }
}