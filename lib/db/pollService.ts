import {
  Poll,
  CreatePollRequest,
  VoteRequest,
  PollFilters,
  PollStats,
} from "../types/poll";

// TODO: Replace with actual database implementation
// This is a placeholder service that simulates API calls

class PollService {
  private baseUrl = "/api/polls";
  private polls: Poll[] = [];

  constructor() {
    // Initialize with some mock data
    this.polls = [
      {
        id: "1",
        title: "What's your favorite programming language?",
        description: "Let's see what the community prefers for development",
        options: [
          { id: "1-1", text: "JavaScript", votes: 45, percentage: 28.8 },
          { id: "1-2", text: "Python", votes: 38, percentage: 24.4 },
          { id: "1-3", text: "TypeScript", votes: 32, percentage: 20.5 },
          { id: "1-4", text: "Rust", votes: 25, percentage: 16.0 },
          { id: "1-5", text: "Go", votes: 16, percentage: 10.3 },
        ],
        totalVotes: 156,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        author: "John Doe",
        authorId: "user-1",
        isActive: true,
        expiresAt: "2024-02-15T10:00:00Z",
        isMultipleChoice: false,
        tags: ["programming", "languages"],
        category: "Technology",
      },
      {
        id: "2",
        title: "Best framework for building APIs?",
        description: "Share your experience with different frameworks",
        options: [
          { id: "2-1", text: "Express.js", votes: 25, percentage: 28.1 },
          { id: "2-2", text: "FastAPI", votes: 22, percentage: 24.7 },
          { id: "2-3", text: "Spring Boot", votes: 18, percentage: 20.2 },
          { id: "2-4", text: "Laravel", votes: 15, percentage: 16.9 },
          { id: "2-5", text: "Django", votes: 9, percentage: 10.1 },
        ],
        totalVotes: 89,
        createdAt: "2024-01-14T15:30:00Z",
        updatedAt: "2024-01-14T15:30:00Z",
        author: "Jane Smith",
        authorId: "user-2",
        isActive: true,
        isMultipleChoice: false,
        tags: ["frameworks", "apis"],
        category: "Technology",
      },
    ];
  }

  async getPolls(filters?: PollFilters): Promise<Poll[]> {
    // TODO: Replace with actual API call
    console.log("Getting polls with filters:", filters);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredPolls = [...this.polls];

    // Apply filters
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPolls = filteredPolls.filter(
        (poll) =>
          poll.title.toLowerCase().includes(searchTerm) ||
          poll.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.status && filters.status !== "all") {
      filteredPolls = filteredPolls.filter((poll) =>
        filters.status === "active" ? poll.isActive : !poll.isActive
      );
    }

    if (filters?.authorId) {
      filteredPolls = filteredPolls.filter(
        (poll) => poll.authorId === filters.authorId
      );
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "recent":
          filteredPolls.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "popular":
          filteredPolls.sort((a, b) => b.totalVotes - a.totalVotes);
          break;
        case "votes":
          filteredPolls.sort((a, b) => b.totalVotes - a.totalVotes);
          break;
        case "created":
          filteredPolls.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    return filteredPolls;
  }

  async getPollById(id: string): Promise<Poll | null> {
    // TODO: Replace with actual API call
    console.log("Getting poll by ID:", id);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const poll = this.polls.find((p) => p.id === id);
    return poll || null;
  }

  async createPoll(
    pollData: CreatePollRequest,
    authorId: string
  ): Promise<Poll> {
    // TODO: Replace with actual API call
    console.log("Creating poll:", pollData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newPoll: Poll = {
      id: Date.now().toString(),
      title: pollData.title,
      description: pollData.description,
      options: pollData.options.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        votes: 0,
        percentage: 0,
      })),
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: "Current User", // TODO: Get from auth context
      authorId,
      isActive: true,
      expiresAt: pollData.expiresAt,
      isMultipleChoice: pollData.isMultipleChoice,
      tags: pollData.tags,
      category: pollData.category,
    };

    this.polls.push(newPoll);
    return newPoll;
  }

  async voteOnPoll(voteData: VoteRequest): Promise<boolean> {
    // TODO: Replace with actual API call
    console.log("Voting on poll:", voteData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const poll = this.polls.find((p) => p.id === voteData.pollId);
    if (!poll) return false;

    // Update vote counts
    voteData.optionIds.forEach((optionId) => {
      const option = poll.options.find((o) => o.id === optionId);
      if (option) {
        option.votes++;
      }
    });

    poll.totalVotes++;

    // Recalculate percentages
    poll.options.forEach((option) => {
      option.percentage = (option.votes / poll.totalVotes) * 100;
    });

    poll.updatedAt = new Date().toISOString();

    return true;
  }

  async getUserStats(userId: string): Promise<PollStats> {
    // TODO: Replace with actual API call
    console.log("Getting user stats for:", userId);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const userPolls = this.polls.filter((p) => p.authorId === userId);
    const totalVotes = userPolls.reduce(
      (sum, poll) => sum + poll.totalVotes,
      0
    );
    const averageVotesPerPoll =
      userPolls.length > 0 ? totalVotes / userPolls.length : 0;

    return {
      totalPolls: this.polls.length,
      totalVotes,
      pollsCreated: userPolls.length,
      pollsVoted: 7, // TODO: Calculate from actual vote history
      averageVotesPerPoll,
    };
  }

  async deletePoll(pollId: string, userId: string): Promise<boolean> {
    // TODO: Replace with actual API call
    console.log("Deleting poll:", pollId);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pollIndex = this.polls.findIndex((p) => p.id === pollId);
    if (pollIndex === -1) return false;

    const poll = this.polls[pollIndex];
    if (poll.authorId !== userId) return false;

    this.polls.splice(pollIndex, 1);
    return true;
  }

  async updatePoll(
    pollId: string,
    updates: Partial<Poll>,
    userId: string
  ): Promise<Poll | null> {
    // TODO: Replace with actual API call
    console.log("Updating poll:", pollId, updates);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const poll = this.polls.find((p) => p.id === pollId);
    if (!poll || poll.authorId !== userId) return null;

    Object.assign(poll, updates);
    poll.updatedAt = new Date().toISOString();

    return poll;
  }
}

export const pollService = new PollService();
export default pollService;
