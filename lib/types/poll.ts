export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: string;
  updatedAt: string;
  author: string;
  authorId: string;
  isActive: boolean;
  expiresAt?: string;
  isMultipleChoice: boolean;
  tags?: string[];
  category?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface CreatePollRequest {
  title: string;
  description: string;
  options: string[];
  isMultipleChoice: boolean;
  expiresAt?: string;
  tags?: string[];
  category?: string;
}

export interface VoteRequest {
  pollId: string;
  optionIds: string[];
}

export interface PollFilters {
  search?: string;
  status?: "all" | "active" | "closed";
  sortBy?: "recent" | "popular" | "votes" | "created";
  category?: string;
  authorId?: string;
}

export interface PollStats {
  totalPolls: number;
  totalVotes: number;
  pollsCreated: number;
  pollsVoted: number;
  averageVotesPerPoll: number;
}
