import { PollStatus, VoteType } from "./database";

export interface Poll {
  id: string;
  title: string;
  description: string | null;
  author_id: string;
  status: PollStatus;
  vote_type: VoteType;
  is_anonymous: boolean;
  expires_at: string | null;
  tags: string[] | null;
  category: string | null;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  order_index: number;
  created_at: string;
}

export interface CreatePollRequest {
  title: string;
  description?: string;
  options: string[];
  vote_type: VoteType;
  is_anonymous?: boolean;
  expires_at?: string;
  tags?: string[];
  category?: string;
}

export interface VoteRequest {
  poll_id: string;
  option_ids: string[];
}

export interface PollFilters {
  search?: string;
  status?: PollStatus | "all";
  sortBy?: "recent" | "popular" | "votes" | "created";
  category?: string;
  author_id?: string;
}

export interface PollStats {
  totalPolls: number;
  totalVotes: number;
  pollsCreated: number;
  pollsVoted: number;
  averageVotesPerPoll: number;
}

// Extended types for application use
export interface PollWithOptions extends Poll {
  options: PollOption[];
  author: {
    id: string;
    full_name: string | null;
    email: string;
  };
}

export interface PollWithResults extends PollWithOptions {
  results: {
    option_id: string;
    option_text: string;
    vote_count: number;
    percentage: number;
  }[];
}
