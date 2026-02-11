import { ChatWidget } from "@/components/ChatWidget";
import { Mountain } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Demo Banner */}
      <div className="bg-demo-banner text-demo-banner-foreground px-4 py-2 text-center text-xs font-medium tracking-wide">
        🏔️ Demo Mode — AI Customer Service for Summit Outdoors
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-lg">
          {/* Branding above widget */}
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5">
              <Mountain className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-accent-foreground">
                AI-Powered Support
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Customer Service, Reimagined
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              See how AI handles real customer questions — instantly, 24/7.
            </p>
          </div>

          {/* Chat Widget */}
          <div className="h-[520px] md:h-[580px]">
            <ChatWidget />
          </div>

          {/* Footer */}
          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Powered by AI • Trained on your store data • Ready in minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
