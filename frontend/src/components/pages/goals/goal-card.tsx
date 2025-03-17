import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface GoalCardProps {
  title: string;
  progress: number;
  imageSrc?: string;
}

function shortenTitle(title: string) {
  if (title.length > 55) {
    return title.substring(0, 55) + "...";
  } else {
    return title;
  }
}

export default function GoalCard({ imageSrc, title, progress }: GoalCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <Card className="overflow-hidden max-w-md mx-auto w-full p-0  group">
      <CardContent className="p-0">
        <div className="relative w-full" style={{ aspectRatio: "5/7.2" }}>
          {/* Using inline style for the specific 5:7 aspect ratio */}
          <div className="absolute p-2 flex-col inset-0 bg-muted flex gap-2 group-hover:bg-card transition-colors duration-300">
            <img
              src={imageSrc || "/placeholder.svg"}
              alt=""
              className={`aspect-[5/5.5] rounded-md object-cover object-center transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="h-full flex items-center">
              <h3 className="font-normal text-sm ">{shortenTitle(title)}</h3>
            </div>
            <div className="w-full  flex items-center justify-center gap-2 mt-auto">
              <div className="w-full h-3 rounded-full bg-muted-foreground/30">
                <div
                  className="bg-violet-600 h-3 rounded-full align-baseline transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
