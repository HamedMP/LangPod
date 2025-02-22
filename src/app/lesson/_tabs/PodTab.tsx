import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, SkipBack, SkipForward } from "lucide-react";

// this looks ait with full-width too, if u set min-w-fit on parent
export const PodTab = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/50 rounded-lg">
        <p className="text-4xl font-semibold text-center leading-relaxed text-foreground/80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        </p>
      </div>
      
      <div className="border-t bg-background p-6 mt-3">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">1:23</span>
            <Slider
              defaultValue={[33]}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm font-medium text-muted-foreground">3:45</span>
          </div>
          
          <div className="flex items-center justify-center gap-6">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="default">
              <Play className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
