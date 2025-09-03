"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Plus, BarChart3, Users, TrendingUp, Loader2, Eye, Edit, Trash2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { pollService } from "@/lib/db/pollService";
import { PollWithOptions, PollStats } from "@/lib/types/poll";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<PollStats | null>(null);
  const [userPolls, setUserPolls] = useState<PollWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [stats, polls] = await Promise.all([
        pollService.getUserStats(user.id),
        pollService.getUserPolls(user.id)
      ]);
      
      setUserStats(stats);
      setUserPolls(polls);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!user || !confirm("Are you sure you want to delete this poll? This action cannot be undone.")) return;

    try {
      await pollService.deletePoll(pollId, user.id);
      // Refresh data
      await fetchDashboardData();
    } catch (error) {
      console.error("Error deleting poll:", error);
      alert("Failed to delete poll. Please try again.");
    }
  };

  const handleEditPoll = (pollId: string) => {
    router.push(`/polls/${pollId}/edit`);
  };

  const handleViewPoll = (pollId: string) => {
    router.push(`/polls/${pollId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return new Date(dateString).toLocaleDateString();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-500" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.user_metadata?.name || user?.email}! Here's what's happening with your polls.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-red-700 mb-4">{error}</p>
                  <Button onClick={fetchDashboardData} variant="outline">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                      {userStats?.totalPolls || 0}
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
                      {userStats?.totalVotes || 0}
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
                      {userStats?.pollsCreated || 0}
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
                      {userStats?.pollsVoted || 0}
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
                <Link href="/profile">
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Account
                  </Button>
                </Link>
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
                  {userPolls.length > 0 ? (
                    <>
                      {userPolls.slice(0, 3).map((poll) => (
                        <div
                          key={poll.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {poll.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(poll.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(poll.status)}
                            <span className="text-sm text-gray-600">
                              {poll.total_votes} votes
                            </span>
                            <div className="flex items-center space-x-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewPoll(poll.id)}
                                className="h-8 w-8 p-0"
                                title="View Poll"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPoll(poll.id)}
                                className="h-8 w-8 p-0"
                                title="Edit Poll"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePoll(poll.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete Poll"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Link href="/polls">
                        <Button variant="outline" className="w-full">
                          View All Polls
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't created any polls yet.</p>
                      <Link href="/polls/create">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Poll
                        </Button>
                      </Link>
                    </div>
                  )}
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
                  {userPolls.length > 0 ? (
                    <>
                      {userPolls.slice(0, 3).map((poll) => (
                        <div key={poll.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              Created poll "{poll.title}"
                            </p>
                            <p className="text-xs text-gray-600">{formatDate(poll.created_at)}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Link href={`/polls/${poll.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeletePoll(poll.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        View Full Activity
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No activity yet. Start by creating a poll!</p>
                      <Link href="/polls/create">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Poll
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
