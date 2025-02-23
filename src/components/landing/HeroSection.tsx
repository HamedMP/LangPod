import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8 animate-in max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary animate-float">
            <Sparkles size={16} />
            <span className="text-sm font-medium">
              AI-Powered Language Learning
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Master Any Language with
            <span className="text-primary"> AI Conversations</span>
          </h1>

          <p className="text-xl text-gray-600">
            Experience personalized, scenario-based lessons using advanced voice
            technology. Learn naturally through dynamic conversations.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <SignedIn>
              <Link href="/?view=all">
                <Button className="glow-button relative inline-flex items-center justify-center text-lg px-8 py-3 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
                  Start Learning
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="glow-button relative inline-flex items-center justify-center text-lg px-8 py-3 rounded-md bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
                  Start Learning
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      <style>
        {`
          .glow-button {
            position: relative;
          }

          .glow-button::after {
            content: '';
            position: absolute;
            left: -2px;
            bottom: 2px;
            width: calc(100% + 4px);
            height: 3px;
            background: linear-gradient(
              90deg,
              hsl(0, 100%, 50%),
              hsl(30, 100%, 50%),
              hsl(60, 100%, 50%),
              hsl(150, 100%, 50%),
              hsl(210, 100%, 50%),
              hsl(270, 100%, 50%),
              hsl(330, 100%, 50%)
            );
            background-size: 200% 100%;
            animation: moveGradient 3s linear infinite;
            border-radius: 4px;
            filter: blur(4px);
            opacity: 0.8;
            z-index: -1;
          }

          @keyframes moveGradient {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
