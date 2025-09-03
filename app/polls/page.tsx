"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PollCard from "@/components/polls/PollCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { pollService } from "@/lib/db/pollService";
import { PollWithOptions, PollFilters } from "@/lib/types/poll";
import { PollStatus } from "@/lib/types/database";
import { Loader2, Search, Filter, Plus } from "lucide-react";

export default function PollsPage() {
  const router = useRouter();
  const [polls, setPolls] = useState<PollWithOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successType, setSuccessType] = useState<"created" | "updated" | null>(
    null
  );
  const [filters, setFilters] = useState<PollFilters>({
    search: "",
    status: "all",
    sortBy: "recent",
  });

  useEffect(() => {
    fetchPolls();
  }, [filters]);

  useEffect(() => {
    // Check if we're coming from poll creation or editing (URL search params)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("created") === "true") {
      setShowSuccessMessage(true);
      setSuccessType("created");
      // Remove the query parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessType(null);
      }, 5000);
    }

    if (urlParams.get("updated") === "true") {
      setShowSuccessMessage(true);
      setSuccessType("updated");
      // Remove the query parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessType(null);
      }, 5000);
    }
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const fetchedPolls = await pollService.getPolls(filters);
      setPolls(fetchedPolls);
      setError(null);
      setShowSuccessMessage(false); // Hide success message on new fetch
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError("Failed to fetch polls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionIds: string[]) => {
    try {
      // For now, just log the vote - you can implement actual voting later
      console.log(`Voting for poll ${pollId}, options:`, optionIds);
      // TODO: Implement actual voting functionality
      // await pollService.voteOnPoll({ poll_id: pollId, option_ids: optionIds });
      // Refresh polls to show updated vote counts
      // await fetchPolls();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleView = (pollId: string) => {
    router.push(`/polls/${pollId}`);
  };

  const handleEdit = (pollId: string) => {
    router.push(`/polls/${pollId}/edit`);
  };

  const handleDelete = async (pollId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this poll? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // For now, we'll just remove it from the local state
      // In a real app, you'd call the API to delete it
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
      // TODO: Implement actual deletion via pollService
      // await pollService.deletePoll(pollId, user?.id);
    } catch (error) {
      console.error("Error deleting poll:", error);
      alert("Failed to delete poll. Please try again.");
    }
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "all" ? "all" : (value as PollStatus),
    }));
  };

  const handleSortBy = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value as any }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      sortBy: "recent",
    });
  };

  if (loading && polls.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-600">Loading polls...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <Button className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Create New Poll
          </Button>
        </Link>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">
                {successType === "created"
                  ? "🎉 Your poll has been created successfully! It's now visible to the community."
                  : "✅ Your poll has been updated successfully! The changes are now live."}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search polls..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.status} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Polls</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="closed">Closed Only</SelectItem>
                <SelectItem value="draft">Draft Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.sortBy} onValueChange={handleSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="votes">Most Votes</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={fetchPolls} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Polls Grid */}
      {polls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll, index) => (
            <div key={poll.id} className="relative">
              {showSuccessMessage && index === 0 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    New!
                  </div>
                </div>
              )}
              <PollCard
                poll={poll}
                onVote={handleVote}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search || filters.status !== "all"
                ? "No polls match your filters"
                : "No polls found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.status !== "all"
                ? "Try adjusting your search or filters to find more polls."
                : "Be the first to create a poll and start the conversation!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {(filters.search || filters.status !== "all") && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
              <Link href="/polls/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Poll
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading more indicator */}
      {loading && polls.length > 0 && (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
          <p className="text-gray-600 mt-2">Loading...</p>
        </div>
      )}
    </div>
  );
}
