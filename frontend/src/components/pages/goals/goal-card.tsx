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

export default function GoalCard({ title, progress, image_url }: GoalCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video">
          {image_url ? (
            <img
              src={image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{shortenTitle(title)}</h3>
          <div className="mt-2">
            <div className="h-2 bg-muted rounded-full">
              <div
                className="h-full bg-violet-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.floor(progress)}% complete
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
