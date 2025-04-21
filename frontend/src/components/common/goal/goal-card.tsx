import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface GoalCardProps {
  title: string;
  progress: number;
  image_url?: string;
}

function shortenTitle(title: string) {
  if (title.length > 55) {
    return title.substring(0, 55) + "...";
  } else {
    return title;
  }
}

export default function GoalCard({ image_url, title, progress }: GoalCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Card className="overflow-hidden max-w-md mx-auto w-full !p-0 group cursor-pointer hover:shadow-lg transition-all duration-300">
      <CardContent className="!p-0">
        <div className="relative w-full" style={{ aspectRatio: "5/6" }}>
          {/* Using inline style for the specific 5:6 aspect ratio */}
          <div className="absolute p-1.5 sm:p-2 flex-col inset-0 bg-muted flex gap-1.5 sm:gap-2 group-hover:bg-card/80 transition-colors duration-300">
            <img
              src={image_url || "/placeholder.svg"}
              alt=""
              className={`aspect-[5/4] sm:aspect-[5/5.5] rounded-md object-cover object-center transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="h-full flex items-center">
              <h3 className="font-normal text-xs sm:text-sm group-hover:text-foreground transition-colors duration-300">{shortenTitle(title)}</h3>
            </div>
            <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mt-auto">
              <div className="w-full h-1.5 sm:h-3 rounded-full bg-muted-foreground/30">
                <div
                  className="bg-violet-600 h-1.5 sm:h-3 rounded-full align-baseline transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{Math.floor(progress)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}