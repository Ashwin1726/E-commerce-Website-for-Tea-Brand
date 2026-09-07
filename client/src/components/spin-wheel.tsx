import { useState, useRef } from "react";
import { X, Gift, Sparkles, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useStore } from "../lib/store";
import { useToast } from "../hooks/use-toast";

const WHEEL_SEGMENTS = [
  { label: "10% OFF", color: "#0ea5e9", value: 10, type: "discount" },
  { label: "50 Points", color: "#38bdf8", value: 50, type: "points" },
  { label: "Free Ship", color: "#7dd3fc", value: 0, type: "free_shipping" },
  { label: "5% OFF", color: "#0ea5e9", value: 5, type: "discount" },
  { label: "100 Points", color: "#38bdf8", value: 100, type: "points" },
  { label: "15% OFF", color: "#7dd3fc", value: 15, type: "discount" },
  { label: "25 Points", color: "#0ea5e9", value: 25, type: "points" },
  { label: "Try Again", color: "#38bdf8", value: 0, type: "none" },
];

interface SpinWheelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpinWheel({ open, onOpenChange }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<typeof WHEEL_SEGMENTS[0] | null>(null);
  const { user } = useStore();
  const { toast } = useToast();
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = async () => {
    if (isSpinning || !user) return;

    setIsSpinning(true);
    setResult(null);

    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const winningIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const spinRotations = 5;
    const targetRotation = spinRotations * 360 + (360 - winningIndex * segmentAngle - segmentAngle / 2);
    
    setRotation(rotation + targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const wonSegment = WHEEL_SEGMENTS[winningIndex];
      setResult(wonSegment);
      
      if (wonSegment.type !== "none") {
        toast({
          title: "Congratulations!",
          description: `You won: ${wonSegment.label}`,
        });
      }
    }, 5000);
  };

  const segmentAngle = 360 / WHEEL_SEGMENTS.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-center">
            <Gift className="h-5 w-5 text-primary" />
            Spin & Win
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary" />
            </div>

            <div
              ref={wheelRef}
              className="w-full h-full rounded-full relative overflow-hidden border-4 border-primary shadow-lg"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
              }}
            >
              {WHEEL_SEGMENTS.map((segment, index) => {
                const startAngle = index * segmentAngle;
                const endAngle = (index + 1) * segmentAngle;
                const midAngle = (startAngle + endAngle) / 2;
                
                return (
                  <div
                    key={index}
                    className="absolute w-full h-full"
                    style={{
                      clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180)}%)`,
                      backgroundColor: segment.color,
                    }}
                  >
                    <span
                      className="absolute text-xs font-bold text-white whitespace-nowrap"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `rotate(${midAngle}deg) translateY(-90px) rotate(90deg)`,
                        transformOrigin: "0 0",
                      }}
                    >
                      {segment.label}
                    </span>
                  </div>
                );
              })}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          {result && (
            <div className="text-center mb-4 animate-in fade-in slide-in-from-bottom-4">
              {result.type === "none" ? (
                <p className="text-muted-foreground">Better luck next time!</p>
              ) : (
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-lg font-semibold text-primary">
                    You won: {result.label}!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your reward has been added to your account
                  </p>
                </div>
              )}
            </div>
          )}

          <Button
            size="lg"
            onClick={spin}
            disabled={isSpinning || !user}
            className="min-w-[160px]"
            data-testid="button-spin"
          >
            {isSpinning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Spinning...
              </>
            ) : (
              <>
                <Gift className="h-4 w-4 mr-2" />
                Spin Now
              </>
            )}
          </Button>

          {!user && (
            <p className="text-sm text-muted-foreground mt-4">
              Please login to spin the wheel
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
