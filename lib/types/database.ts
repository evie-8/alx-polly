// Database types that match the Supabase schema
export type PollStatus = "active" | "closed" | "draft";
export type VoteType = "single" | "multiple";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      polls: {
        Row: {
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
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          author_id: string;
          status?: PollStatus;
          vote_type?: VoteType;
          is_anonymous?: boolean;
          expires_at?: string | null;
          tags?: string[] | null;
          category?: string | null;
          total_votes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          author_id?: string;
          status?: PollStatus;
          vote_type?: VoteType;
          is_anonymous?: boolean;
          expires_at?: string | null;
          tags?: string[] | null;
          category?: string | null;
          total_votes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          text: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          text: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          text?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          poll_id: string;
          voter_id: string | null;
          voter_ip: string | null;
          voter_user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          voter_id?: string | null;
          voter_ip?: string | null;
          voter_user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          voter_id?: string | null;
          voter_ip?: string | null;
          voter_user_agent?: string | null;
          created_at?: string;
        };
      };
      vote_options: {
        Row: {
          id: string;
          vote_id: string;
          option_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          vote_id: string;
          option_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          vote_id?: string;
          option_id?: string;
          created_at?: string;
        };
      };
      poll_shares: {
        Row: {
          id: string;
          poll_id: string;
          shared_by: string | null;
          platform: string | null;
          shared_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          shared_by?: string | null;
          platform?: string | null;
          shared_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          shared_by?: string | null;
          platform?: string | null;
          shared_at?: string;
        };
      };
      poll_views: {
        Row: {
          id: string;
          poll_id: string;
          viewer_id: string | null;
          viewer_ip: string | null;
          viewer_user_agent: string | null;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          viewer_id?: string | null;
          viewer_ip?: string | null;
          viewer_user_agent?: string | null;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          viewer_id?: string | null;
          viewer_ip?: string | null;
          viewer_user_agent?: string | null;
          viewed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_poll_results: {
        Args: {
          poll_uuid: string;
        };
        Returns: {
          option_id: string;
          option_text: string;
          vote_count: number;
          percentage: number;
        }[];
      };
      update_updated_at_column: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      update_poll_vote_count: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      handle_new_user: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: {
      poll_status: PollStatus;
      vote_type: VoteType;
    };
  };
}

// Helper types for common operations
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Poll = Database["public"]["Tables"]["polls"]["Row"];
export type PollOption = Database["public"]["Tables"]["poll_options"]["Row"];
export type Vote = Database["public"]["Tables"]["votes"]["Row"];
export type VoteOption = Database["public"]["Tables"]["vote_options"]["Row"];
export type PollShare = Database["public"]["Tables"]["poll_shares"]["Row"];
export type PollView = Database["public"]["Tables"]["poll_views"]["Row"];

// Insert types
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type PollInsert = Database["public"]["Tables"]["polls"]["Insert"];
export type PollOptionInsert =
  Database["public"]["Tables"]["poll_options"]["Insert"];
export type VoteInsert = Database["public"]["Tables"]["votes"]["Insert"];
export type VoteOptionInsert =
  Database["public"]["Tables"]["vote_options"]["Insert"];

// Update types
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type PollUpdate = Database["public"]["Tables"]["polls"]["Update"];
export type PollOptionUpdate =
  Database["public"]["Tables"]["poll_options"]["Update"];
export type VoteUpdate = Database["public"]["Tables"]["votes"]["Update"];
export type VoteOptionUpdate =
  Database["public"]["Tables"]["vote_options"]["Update"];

// Extended types for application use
export interface PollWithOptions extends Poll {
  options: PollOption[];
  author: Profile;
}

export interface PollWithResults extends PollWithOptions {
  results: {
    option_id: string;
    option_text: string;
    vote_count: number;
    percentage: number;
  }[];
}

export interface VoteWithOptions extends Vote {
  options: VoteOption[];
}

export interface UserProfile extends Profile {
  polls: Poll[];
  votes: Vote[];
}
