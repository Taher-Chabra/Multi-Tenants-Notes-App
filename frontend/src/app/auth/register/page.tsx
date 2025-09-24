"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { register } from "module";
import { registerUser } from "@/services/auth";
import { redirect } from "next/dist/client/components/navigation";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
      /^[a-zA-Z_]+$/,
      "Username must contain only letters and underscores"
    ),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string(),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({ confirmPassword: "" });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error.confirmPassword) {
      toast.error("Please fix the errors");
      return;
    }

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const errors = validation.error.issues
        .map((issue) => issue.message)
        .join("\n");
      toast.error(`Validation errors:\n ${errors}`);
      return;
    }

    const response = await registerUser(
      formData.username,
      formData.email,
      formData.password
    );
    if (!response.success) {
      toast.error(response.message || "Registration failed. Please try again.");
      return;
    }

    toast.success("Registration successful! You can now log in.");
    redirect("/auth/login");
  };

  useEffect(() => {
    if (!formData.confirmPassword) return;

    setError((prev) => ({
      ...prev,
      confirmPassword:
        formData.confirmPassword !== formData.password
          ? "Passwords does not match"
          : "",
    }));
  }, [formData.password, formData.confirmPassword]);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 min-h-screen lg:min-h-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-4 sm:space-y-6 text-center pb-6 sm:pb-8">
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Create Account
                </CardTitle>
                <CardDescription className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                  Register as a member to join your organization's workspace and
                  start collaborating on notes.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-foreground"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="enter your username"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors"
                    required
                  />
                </div>

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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
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

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-foreground"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary transition-colors pr-12"
                      required
                    />
                    {error && error.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {error.confirmPassword}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    You would be registered as a member
                  </p>
                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                  >
                    Create Account
                  </Button>
                </div>
              </form>

              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  {"Already have an account? "}
                  <Link
                    href="/auth/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-lg mx-auto">
          <div className="w-24 h-24 xl:w-32 xl:h-32 mx-auto bg-secondary/10 flex items-center justify-center rounded-2xl">
            <div className="w-12 h-12 xl:w-16 xl:h-16 bg-secondary rounded-lg"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground tracking-tight">
              Join TenantNotes
            </h2>
            <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
              Start managing your properties with powerful tools designed to
              simplify your workflow and enhance productivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
