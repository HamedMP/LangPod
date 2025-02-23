import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";

export const CoachTab = () => {
  return (
    <div className="space-y-4">
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Mic className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Pronunciation Coach
          </h2>
          <p className="text-muted-foreground max-w-[500px]">
            Soon you'll be able to record your voice and get instant AI feedback
            on your pronunciation. Our advanced AI will analyze your speech
            patterns and provide detailed guidance to help you sound more like a
            native speaker.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[500px] mt-4">
            <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
              <span className="font-semibold">Record</span>
              <span className="text-sm text-muted-foreground">
                Submit voice samples
              </span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
              <span className="font-semibold">Analyze</span>
              <span className="text-sm text-muted-foreground">
                AI assessment
              </span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
              <span className="font-semibold">Improve</span>
              <span className="text-sm text-muted-foreground">
                Get feedback
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
