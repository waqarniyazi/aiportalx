// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  googleId?: string;
  githubId?: string;
  email?: string;
  username?: string;
}

const UserSchema = new Schema<IUser>({
  googleId: String,
  githubId: String,
  email: String,
  username: String,
});

export const User = mongoose.model<IUser>("User", UserSchema);
