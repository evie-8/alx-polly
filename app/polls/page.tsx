import PollCard from "@/components/polls/PollCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers for development",
    options: ["JavaScript", "Python", "TypeScript", "Rust", "Go"],
    totalVotes: 156,
    createdAt: "2024-01-15T10:00:00Z",
    author: "John Doe",
    isActive: true,
  },
  {
    id: "2",
    title: "Best framework for building APIs?",
    description: "Share your experience with different frameworks",
    options: ["Express.js", "FastAPI", "Spring Boot", "Laravel", "Django"],
    totalVotes: 89,
    createdAt: "2024-01-14T15:30:00Z",
    author: "Jane Smith",
    isActive: true,
  },
  {
    id: "3",
    title: "Preferred database for web apps?",
    description: "What database technology do you use most?",
    options: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite"],
    totalVotes: 203,
    createdAt: "2024-01-13T09:15:00Z",
    author: "Mike Johnson",
    isActive: false,
  },
];

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Polls</h1>
          <p className="text-gray-600 mt-2">
            Discover what others are thinking and share your opinion
          </p>
        </div>
        <Link href="/polls/create">
          <Button className="mt-4 md:mt-0">Create New Poll</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search polls..." />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">All Polls</option>
              <option value="active">Active Only</option>
              <option value="closed">Closed Only</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="votes">Most Votes</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Polls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPolls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            onVote={(pollId, optionIndex) => {
              console.log(`Voting for poll ${pollId}, option ${optionIndex}`);
            }}
            onView={(pollId) => {
              console.log(`Viewing poll ${pollId}`);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {mockPolls.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No polls found
            </h3>
            <p className="text-gray-600 mb-4">
              Be the first to create a poll and start the conversation!
            </p>
            <Link href="/polls/create">
              <Button>Create Your First Poll</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
