"use client";

import { useEffect, useState } from "react";
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
import { PollWithResults } from "@/lib/types/poll";
import { useAuth } from "@/contexts/AuthContext";
import pollService from "@/lib/db/pollService";
import { useParams } from "next/navigation";

export default function PollDetailPage() {
  const params = useParams();
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  const [poll, setPoll] = useState<PollWithResults | null>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchPoll = async () => {
    try {
      setLoading(true);
      const pollData = await pollService.getPollById(params.id as string);

      if (!pollData) {
        setError("Poll not found");
        return;
      }

      // Check if user owns this poll
      // if (pollData.author_id !== user?.id) {
      //   setError("You can only edit your own polls");
      //   return;
      // }

      setPoll(pollData);
    } catch (error) {
      console.error("Error fetching poll:", error);
      setError("Failed to load poll");
    } finally {
      setLoading(false);
    }
  };
  const handleOptionSelect = (optionIndex: number) => {
    if (poll?.vote_type === "multiple") {
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
  useEffect(() => {
    if (params.id && user) {
      fetchPoll();
    }
  }, [params.id, user]);
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
                {poll?.title}
              </h1>
              <p className="text-gray-600 text-lg">{poll?.description}</p>
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
            <span>By {poll?.author.full_name}</span>
            <span>•</span>
            <span>Created {formatDate(poll?.created_at as string)}</span>
            {(poll?.expires_at as string) && (
              <>
                <span>•</span>
                <span>Expires {formatDate(poll?.expires_at as string)}</span>
              </>
            )}
            <span>•</span>
            <Badge
              variant={poll?.status === "active" ? "default" : "secondary"}
            >
              {poll?.status === "active" ? "Active" : "Closed"}
            </Badge>
          </div>
        </div>

        {/* Poll Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Poll Options
              <span className="text-sm font-normal text-gray-600">
                {poll?.total_votes} total votes
              </span>
            </CardTitle>
            {poll?.vote_type === "multiple" && (
              <CardDescription>Select one or more options</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasVoted ? (
              <>
                {poll?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type={
                        poll?.vote_type === "multiple" ? "checkbox" : "radio"
                      }
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
                {poll?.results.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {option.option_text}
                      </span>
                      <span className="text-sm text-gray-600">
                        {option.vote_count} votes ({option?.percentage}%)
                      </span>
                    </div>
                    <Progress value={option?.percentage} className="h-2" />
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
                <span className="font-medium">{poll?.total_votes}</span>
              </div>
              <div className="flex justify-between">
                <span>Options:</span>
                <span className="font-medium">{poll?.options.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Multiple Choice:</span>
                <span className="font-medium">
                  {poll?.vote_type === "multiple" ? "Yes" : "No"}
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
