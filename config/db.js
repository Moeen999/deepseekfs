import mongoose from "mongoose";

// ! The entire file is quite important as it not only configures the database connection but also checks whether the connection is already established or in the process of being established. This caching mechanism is crucial for performance optimization, especially in serverless environments where functions may be invoked multiple times in quick succession.
let cached = global.mongoose || { conn: null, promise: null };
export default async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
  return cached.conn;
}
