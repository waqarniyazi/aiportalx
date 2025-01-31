import mongoose, { Document, Model } from "mongoose";

interface IUser extends Document {
  name: string;
  username: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User: Model<IUser> =
  mongoose.models.user || mongoose.model<IUser>("user", userSchema);

export default User;
