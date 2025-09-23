import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  tenantId: mongoose.Types.ObjectId;
  refreshToken?: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    refreshToken: {
      type: String,
      select: false
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }

    this.password = await bcrypt.hash(user.password, 10);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
   const payload = {
      id: this._id,
      username: this.username,
      role: this.role,
      tenantId: this.tenantId
   }

   return jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn'] }
   )
}

userSchema.methods.generateRefreshToken = function (): string {
   const payload = {
      id: this._id,
   }

   return jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn'] }
   )
}

export const User = mongoose.model("User", userSchema);
