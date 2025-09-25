import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage:
            "url('/modern-office-workspace-with-laptops-and-notebooks.jpg')",
        }}
      />

      <div className="relative z-10">
        <div className="absolute top-8 left-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                T
              </span>
            </div>
            <span className="text-xl font-semibold text-foreground">
              TenantNotes
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight tracking-tight">
              Notes for teams
              <br />
              <span className="text-primary">building together</span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground max-w-2xl mx-auto leading-relaxed">
              {
                "Empower your entire organization to create, collaborate, and innovate with secure, multi-tenant note management."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-medium min-w-[160px]"
              >
                <Link href="/register">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary text-primary bg-primary/10 hover:bg-primary/10 px-8 py-6 text-lg font-medium min-w-[160px]"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <p className="text-sm text-foreground pt-4">
              {
                "Trusted by teams worldwide • Free tier available • Enterprise ready"
              }
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-8 text-sm text-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Multi-tenant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Role-based access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Real-time collaboration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
