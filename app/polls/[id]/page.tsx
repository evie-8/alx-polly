"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Share2, BarChart3 } from "lucide-react";
import Link from "next/link";

// Mock poll data
const mockPoll = {
  id: "1",
  title: "What's your favorite programming language?",
  description:
    "Let's see what the community prefers for development. This poll will help us understand the current trends in programming language preferences among developers.",
  options: [
    { text: "JavaScript", votes: 45, percentage: 28.8 },
    { text: "Python", votes: 38, percentage: 24.4 },
    { text: "TypeScript", votes: 32, percentage: 20.5 },
    { text: "Rust", votes: 25, percentage: 16.0 },
    { text: "Go", votes: 16, percentage: 10.3 },
  ],
  totalVotes: 156,
  createdAt: "2024-01-15T10:00:00Z",
  author: "John Doe",
  isActive: true,
  expiresAt: "2024-02-15T10:00:00Z",
  isMultipleChoice: false,
};

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    if (mockPoll.isMultipleChoice) {
      setSelectedOptions((prev) =>
        prev.includes(optionIndex)
          ? prev.filter((i) => i !== optionIndex)
          : [...prev, optionIndex]
      );
    } else {
      setSelectedOptions([optionIndex]);
    }
  };

  const handleVote = () => {
    if (selectedOptions.length > 0) {
      setHasVoted(true);
      // TODO: Implement actual voting logic
      console.log("Voting for options:", selectedOptions);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/polls">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Polls
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mockPoll.title}
              </h1>
              <p className="text-gray-600 text-lg">{mockPoll.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Results
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
            <span>By {mockPoll.author}</span>
            <span>•</span>
            <span>Created {formatDate(mockPoll.createdAt)}</span>
            {mockPoll.expiresAt && (
              <>
                <span>•</span>
                <span>Expires {formatDate(mockPoll.expiresAt)}</span>
              </>
            )}
            <span>•</span>
            <Badge variant={mockPoll.isActive ? "default" : "secondary"}>
              {mockPoll.isActive ? "Active" : "Closed"}
            </Badge>
          </div>
        </div>

        {/* Poll Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Poll Options
              <span className="text-sm font-normal text-gray-600">
                {mockPoll.totalVotes} total votes
              </span>
            </CardTitle>
            {mockPoll.isMultipleChoice && (
              <CardDescription>Select one or more options</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasVoted ? (
              <>
                {mockPoll.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type={mockPoll.isMultipleChoice ? "checkbox" : "radio"}
                      name="poll-option"
                      id={`option-${index}`}
                      checked={selectedOptions.includes(index)}
                      onChange={() => handleOptionSelect(index)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option.text}
                    </label>
                  </div>
                ))}
                <Button
                  onClick={handleVote}
                  disabled={selectedOptions.length === 0}
                  className="w-full mt-4"
                >
                  Submit Vote
                </Button>
              </>
            ) : (
              <>
                {mockPoll.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{option.text}</span>
                      <span className="text-sm text-gray-600">
                        {option.votes} votes ({option.percentage}%)
                      </span>
                    </div>
                    <Progress value={option.percentage} className="h-2" />
                  </div>
                ))}
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ Thank you for voting! Your response has been recorded.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Poll Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Total Votes:</span>
                <span className="font-medium">{mockPoll.totalVotes}</span>
              </div>
              <div className="flex justify-between">
                <span>Options:</span>
                <span className="font-medium">{mockPoll.options.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Multiple Choice:</span>
                <span className="font-medium">
                  {mockPoll.isMultipleChoice ? "Yes" : "No"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share This Poll</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                Copy Link
              </Button>
              <Button variant="outline" className="w-full">
                Share on Twitter
              </Button>
              <Button variant="outline" className="w-full">
                Share on LinkedIn
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
