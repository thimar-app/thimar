import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface GoalCardProps {
  title: string;
  progress: number;
  image_url?: string;
}

function shortenTitle(title: string) {
  if (title.length > 40) {
    return title.substring(0, 40) + "...";
  } else {
    return title;
  }
}

export default function GoalCard({ image_url, title, progress }: GoalCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Card className="overflow-hidden max-w-md mx-auto w-full !p-0 group cursor-pointer hover:shadow-lg transition-all duration-300">
      <CardContent className="!p-0">
        <div className="relative w-full" style={{ aspectRatio: "5/7" }}>
          <div className="absolute inset-0 bg-muted flex flex-col p-1 group-hover:bg-card/80 transition-colors duration-300">
            {/* Image container with increased height */}
            <div className="h-4/5">
              <img
                src={image_url || "/placeholder.svg"}
                alt=""
                className={`h-full w-full rounded-sm object-cover object-center transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            
            {/* Compact footer with title and progress */}
            <div className="h-1/5 flex flex-col justify-between py-0.5">
              {/* Title */}
              <h3 className="text-lg line-clamp-1 px-1 group-hover:text-foreground transition-colors duration-300">{shortenTitle(title)}</h3>
              
              {/* Progress bar */}
              <div className="w-full flex items-center justify-center gap-1 px-1">
                <div className="w-full h-2 rounded-full bg-muted-foreground/30">
                  <div
                    className="bg-violet-600 h-1.5 rounded-full align-baseline transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs whitespace-nowrap text-muted-foreground group-hover:text-foreground transition-colors duration-300">{Math.floor(progress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}