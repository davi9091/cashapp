import { Document, Model, model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

export interface IUserDoc extends Document<Schema.Types.ObjectId, {}> {
  username: string;
  password: string;
  token: string;
  firstName: string;
  lastName: string;

  comparePasswords: <T>(
    candidatePassword: string,
    cb: (error: Error, match: T) => void
  ) => T;
}

const userSchema: Schema<IUserDoc> = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
});

userSchema.pre("save", async function (next) {
  const user = this; //TODO: type this!

  if (!user.isModified("password")) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    next();
  } catch (e) {
    next(e);
  }
});

userSchema.methods.comparePasswords = async function (candidatePassword, cb) {
  const { password } = this;
  console.log("password", password);

  try {
    const match = await bcrypt.compare(candidatePassword, password);
    console.log(match);
    cb(null, match);
  } catch (error) {
    console.log(error);
    return cb(error);
  }
};

export const User: Model<IUserDoc> = model("User", userSchema);
