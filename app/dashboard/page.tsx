import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, BarChart3, Users, TrendingUp } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Mock data for demonstration
const mockUserStats = {
  totalPolls: 12,
  totalVotes: 89,
  pollsCreated: 5,
  pollsVoted: 7,
};

const mockRecentPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    votes: 156,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Best framework for building APIs?",
    votes: 89,
    isActive: true,
    createdAt: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    title: "Preferred database for web apps?",
    votes: 203,
    isActive: false,
    createdAt: "2024-01-13T09:15:00Z",
  },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your polls.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Polls
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockUserStats.totalPolls}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Votes
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockUserStats.totalVotes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Plus className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Polls Created
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockUserStats.pollsCreated}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Polls Voted
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {mockUserStats.pollsVoted}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with creating and managing your polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link href="/polls/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Poll
                  </Button>
                </Link>
                <Link href="/polls">
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View All Polls
                  </Button>
                </Link>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Polls Created */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Polls Created</CardTitle>
                <CardDescription>Your latest poll creations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentPolls.slice(0, 3).map((poll) => (
                    <div
                      key={poll.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {poll.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(poll.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={poll.isActive ? "default" : "secondary"}>
                          {poll.isActive ? "Active" : "Closed"}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {poll.votes} votes
                        </span>
                      </div>
                    </div>
                  ))}
                  <Link href="/polls">
                    <Button variant="outline" className="w-full">
                      View All Polls
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        Voted on "Best framework for building APIs?"
                      </p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        Created new poll "What's your favorite programming
                        language?"
                      </p>
                      <p className="text-xs text-gray-600">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        Received 15 votes on your poll
                      </p>
                      <p className="text-xs text-gray-600">2 days ago</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Full Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
