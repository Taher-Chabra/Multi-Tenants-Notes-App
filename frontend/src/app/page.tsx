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
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-20">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary flex items-center justify-center rounded">
              <span className="text-primary-foreground font-bold text-sm sm:text-lg">
                T
              </span>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-foreground">
              TenantNotes
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center pt-16 sm:pt-20 lg:pt-0">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-tight tracking-tight">
              Notes for teams
              <br />
              <span className="text-primary">building together</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground max-w-2xl mx-auto leading-relaxed px-2">
              {
                "Empower your entire organization to create, collaborate, and innovate with secure, multi-tenant note management."
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium w-full sm:w-auto sm:min-w-[160px]"
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary text-primary bg-primary/10 hover:bg-primary/10 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium w-full sm:w-auto sm:min-w-[160px]"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>

            <p className="text-xs sm:text-sm text-foreground pt-4 px-2">
              {
                "Trusted by teams worldwide • Free tier available • Enterprise ready"
              }
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 w-full px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-xs sm:text-sm text-foreground">
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
