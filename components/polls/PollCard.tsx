"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Poll {
  id: string;
  title: string;
  description: string;
  options: string[];
  totalVotes: number;
  createdAt: string;
  author: string;
  isActive: boolean;
}

interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionIndex: number) => void;
  onView?: (pollId: string) => void;
}

export default function PollCard({ poll, onVote, onView }: PollCardProps) {
  const handleVote = (optionIndex: number) => {
    if (onVote) {
      onVote(poll.id, optionIndex);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(poll.id);
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{poll.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {poll.description}
            </CardDescription>
          </div>
          <Badge variant={poll.isActive ? "default" : "secondary"}>
            {poll.isActive ? "Active" : "Closed"}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>By {poll.author}</span>
          <span>{poll.totalVotes} votes</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {poll.options.slice(0, 3).map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <span className="text-sm">{option}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(index)}
                disabled={!poll.isActive}
              >
                Vote
              </Button>
            </div>
          ))}
          {poll.options.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">
              +{poll.options.length - 3} more options
            </p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Created {new Date(poll.createdAt).toLocaleDateString()}
          </span>
          <Button variant="outline" size="sm" onClick={handleView}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
