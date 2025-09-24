"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/services/auth";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(25, "Password must be at most 25 characters long"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors = validation.error.issues
        .map((issue) => issue.message)
        .join("\n");
      toast.error(`Validation errors:\n ${errors}`);
      return;
    }

    const response = await loginUser(email, password);
    if (!response.success) {
      toast.error(response.message || "Login failed. Please try again.");
      return;
    }

    toast.success("Login successful!");
    redirect(`/${response.tenantSlug}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side - Login form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl">
        <CardHeader className="space-y-4 sm:space-y-6 text-center pb-6 sm:pb-8">
          <div className="space-y-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
            >
            Email Address
            </Label>
            <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors"
            required
            />
          </div>

          <div className="space-y-2">
            <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
            >
            Password
            </Label>
            <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            Sign In
          </Button>
          </form>

          <div className="text-center space-y-3 sm:space-y-4">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot your password?
          </Link>

          <div className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link
            href="/auth/register"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
            Sign up
            </Link>
          </div>
          </div>
        </CardContent>
        </Card>
      </div>
      </div>

      {/* Right side - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-lg">
        <div className="w-24 h-24 xl:w-32 xl:h-32 mx-auto bg-primary/10 flex items-center justify-center rounded-2xl">
        <div className="w-12 h-12 xl:w-16 xl:h-16 bg-primary rounded-lg"></div>
        </div>
        <div className="space-y-4">
        <h2 className="text-3xl xl:text-4xl font-bold text-foreground tracking-tight">
          TenantNotes
        </h2>
        <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
          Streamline your property management with our modern, intuitive
          platform designed for efficiency.
        </p>
        </div>
      </div>
      </div>
    </div>
  );
}
