import { createClient } from "@/lib/supabase/client";
import {
  Poll,
  CreatePollRequest,
  VoteRequest,
  PollFilters,
  PollStats,
  PollWithOptions,
  PollWithResults,
} from "../types/poll";
import { PollStatus } from "../types/database";

class PollService {
  private supabase = createClient();

  async getPolls(filters?: PollFilters): Promise<PollWithOptions[]> {
    try {
      let query = this.supabase
        .from("polls")
        .select(
          `
          *,
          options:poll_options(*),
          author:profiles!polls_author_id_fkey(id, full_name, email)
        `
        )
        .eq("status", "active");

      // Apply filters
      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters?.category) {
        query = query.eq("category", filters.category);
      }

      if (filters?.author_id) {
        query = query.eq("author_id", filters.author_id);
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case "recent":
            query = query.order("created_at", { ascending: false });
            break;
          case "popular":
            query = query.order("total_votes", { ascending: false });
            break;
          case "votes":
            query = query.order("total_votes", { ascending: false });
            break;
          case "created":
            query = query.order("created_at", { ascending: false });
            break;
          default:
            query = query.order("created_at", { ascending: false });
        }
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching polls:", error);
        throw new Error("Failed to fetch polls");
      }

      return data || [];
    } catch (error) {
      console.error("Error in getPolls:", error);
      throw new Error("Failed to fetch polls");
    }
  }

  async getPollById(id: string): Promise<PollWithResults | null> {
    try {
      // Get poll with options and author
      const { data: pollData, error: pollError } = await this.supabase
        .from("polls")
        .select(
          `
          *,
          options:poll_options(*),
          author:profiles!polls_author_id_fkey(id, full_name, email)
        `
        )
        .eq("id", id)
        .single();

      if (pollError) {
        console.error("Error fetching poll:", pollError);
        return null;
      }

      // Get poll results using the database function
      const { data: results, error: resultsError } = await this.supabase.rpc(
        "get_poll_results",
        { poll_uuid: id }
      );

      if (resultsError) {
        console.error("Error fetching poll results:", resultsError);
        // Continue without results if the function fails
      }

      return {
        ...pollData,
        results: results || [],
      };
    } catch (error) {
      console.error("Error in getPollById:", error);
      return null;
    }
  }

  async createPoll(
    pollData: CreatePollRequest,
    authorId: string
  ): Promise<PollWithOptions> {
    try {
      // Start a transaction
      const { data: poll, error: pollError } = await this.supabase
        .from("polls")
        .insert({
          title: pollData.title,
          description: pollData.description || null,
          author_id: authorId,
          status: "active" as PollStatus,
          vote_type: pollData.vote_type,
          is_anonymous: pollData.is_anonymous || false,
          expires_at: pollData.expires_at
            ? new Date(pollData.expires_at).toISOString()
            : null,
          tags: pollData.tags || null,
          category: pollData.category || null,
        })
        .select()
        .single();

      if (pollError) {
        console.error("Error creating poll:", pollError);
        throw new Error("Failed to create poll");
      }

      // Create poll options
      const optionsData = pollData.options.map((text, index) => ({
        poll_id: poll.id,
        text,
        order_index: index + 1,
      }));

      const { data: options, error: optionsError } = await this.supabase
        .from("poll_options")
        .insert(optionsData)
        .select();

      if (optionsError) {
        console.error("Error creating poll options:", optionsError);
        // Try to delete the poll if options creation fails
        await this.supabase.from("polls").delete().eq("id", poll.id);
        throw new Error("Failed to create poll options");
      }

      // Get the created poll with options and author
      const { data: fullPoll, error: fetchError } = await this.supabase
        .from("polls")
        .select(
          `
          *,
          options:poll_options(*),
          author:profiles!polls_author_id_fkey(id, full_name, email)
        `
        )
        .eq("id", poll.id)
        .single();

      if (fetchError) {
        console.error("Error fetching created poll:", fetchError);
        throw new Error("Failed to fetch created poll");
      }

      return fullPoll;
    } catch (error) {
      console.error("Error in createPoll:", error);
      throw new Error("Failed to create poll");
    }
  }

  async voteOnPoll(voteData: VoteRequest, voterId?: string): Promise<boolean> {
    try {
      // Check if poll exists and is active
      const { data: poll, error: pollError } = await this.supabase
        .from("polls")
        .select("id, status, vote_type")
        .eq("id", voteData.poll_id)
        .single();

      if (pollError || !poll) {
        throw new Error("Poll not found");
      }

      if (poll.status !== "active") {
        throw new Error("Poll is not active");
      }

      // Check if user has already voted (if authenticated)
      if (voterId) {
        const { data: existingVote } = await this.supabase
          .from("votes")
          .select("id")
          .eq("poll_id", voteData.poll_id)
          .eq("voter_id", voterId)
          .single();

        if (existingVote) {
          throw new Error("You have already voted on this poll");
        }
      }

      // Create the vote
      const { data: vote, error: voteError } = await this.supabase
        .from("votes")
        .insert({
          poll_id: voteData.poll_id,
          voter_id: voterId || null,
        })
        .select()
        .single();

      if (voteError) {
        console.error("Error creating vote:", voteError);
        throw new Error("Failed to create vote");
      }

      // Create vote options
      const voteOptionsData = voteData.option_ids.map((optionId) => ({
        vote_id: vote.id,
        option_id: optionId,
      }));

      const { error: voteOptionsError } = await this.supabase
        .from("vote_options")
        .insert(voteOptionsData);

      if (voteOptionsError) {
        console.error("Error creating vote options:", voteOptionsError);
        // Try to delete the vote if vote options creation fails
        await this.supabase.from("votes").delete().eq("id", vote.id);
        throw new Error("Failed to create vote options");
      }

      return true;
    } catch (error) {
      console.error("Error in voteOnPoll:", error);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<PollStats> {
    try {
      // Get user's polls
      const { data: userPolls, error: pollsError } = await this.supabase
        .from("polls")
        .select("id, total_votes")
        .eq("author_id", userId);

      if (pollsError) {
        console.error("Error fetching user polls:", pollsError);
        throw new Error("Failed to fetch user polls");
      }

      // Get user's votes
      const { count: pollsVoted, error: votesError } = await this.supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("voter_id", userId);

      if (votesError) {
        console.error("Error fetching user votes:", votesError);
        throw new Error("Failed to fetch user votes");
      }

      const totalPolls = userPolls?.length || 0;
      const totalVotes =
        userPolls?.reduce((sum, poll) => sum + (poll.total_votes || 0), 0) || 0;
      const averageVotesPerPoll = totalPolls > 0 ? totalVotes / totalPolls : 0;

      return {
        totalPolls,
        totalVotes,
        pollsCreated: totalPolls,
        pollsVoted: pollsVoted || 0,
        averageVotesPerPoll,
      };
    } catch (error) {
      console.error("Error in getUserStats:", error);
      throw new Error("Failed to fetch user stats");
    }
  }

  async deletePoll(pollId: string, userId: string): Promise<void> {
    try {
      console.log(`Deleting poll ${pollId} by user ${userId}`);
      
      // First verify the user owns this poll
      const { data: poll, error: fetchError } = await this.supabase
        .from("polls")
        .select("author_id")
        .eq("id", pollId)
        .single();

      if (fetchError) {
        console.error("Error fetching poll for deletion:", fetchError);
        throw new Error(`Failed to fetch poll: ${fetchError.message}`);
      }

      if (!poll) {
        throw new Error("Poll not found");
      }

      if (poll.author_id !== userId) {
        throw new Error("You can only delete your own polls");
      }

      // Delete the poll (cascade will handle related records)
      const { error: deleteError } = await this.supabase
        .from("polls")
        .delete()
        .eq("id", pollId);

      if (deleteError) {
        console.error("Error deleting poll:", deleteError);
        throw new Error(`Failed to delete poll: ${deleteError.message}`);
      }

      console.log(`Poll ${pollId} deleted successfully`);
    } catch (error) {
      console.error("Error in deletePoll:", error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to delete poll: ${String(error)}`);
      }
    }
  }

  async updatePoll(
    pollId: string,
    updates: Partial<Poll>,
    userId: string
  ): Promise<Poll | null> {
    try {
      // Check if poll exists and user owns it
      const { data: poll, error: pollError } = await this.supabase
        .from("polls")
        .select("id, author_id")
        .eq("id", pollId)
        .single();

      if (pollError || !poll) {
        throw new Error("Poll not found");
      }

      if (poll.author_id !== userId) {
        throw new Error("You can only update your own polls");
      }

      // Update the poll
      const { data: updatedPoll, error: updateError } = await this.supabase
        .from("polls")
        .update(updates)
        .eq("id", pollId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating poll:", updateError);
        throw new Error("Failed to update poll");
      }

      return updatedPoll;
    } catch (error) {
      console.error("Error in updatePoll:", error);
      throw error;
    }
  }

  async getUserPolls(userId: string): Promise<PollWithOptions[]> {
    try {
      console.log(`Fetching polls for user ${userId}`);
      
      const { data: polls, error } = await this.supabase
        .from("polls")
        .select(`
          *,
          options:poll_options(*),
          author:profiles!polls_author_id_fkey(id, full_name, email)
        `)
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user polls:", error);
        throw new Error(`Failed to fetch user polls: ${error.message}`);
      }

      console.log(`Found ${polls?.length || 0} polls for user ${userId}`);
      return polls || [];
    } catch (error) {
      console.error("Error in getUserPolls:", error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Failed to fetch user polls: ${String(error)}`);
      }
    }
  }

  // Test method to verify database connection and permissions
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("Testing database connection...");
      
      // Test 1: Check if we can read from profiles table
      const { data: profiles, error: profilesError } = await this.supabase
        .from("profiles")
        .select("id, email")
        .limit(1);
      
      if (profilesError) {
        console.error("Error reading profiles:", profilesError);
        return { success: false, error: `Profiles read error: ${profilesError.message}` };
      }
      
      console.log("Profiles read test passed");
      
      // Test 2: Check if we can read from polls table
      const { data: polls, error: pollsError } = await this.supabase
        .from("polls")
        .select("id, title")
        .limit(1);
      
      if (pollsError) {
        console.error("Error reading polls:", pollsError);
        return { success: false, error: `Polls read error: ${pollsError.message}` };
      }
      
      console.log("Polls read test passed");
      
      // Test 3: Check if we can read from poll_options table
      const { data: options, error: optionsError } = await this.supabase
        .from("poll_options")
        .select("id, text")
        .limit(1);
      
      if (optionsError) {
        console.error("Error reading poll_options:", optionsError);
        return { success: false, error: `Poll options read error: ${optionsError.message}` };
      }
      
      console.log("Poll options read test passed");
      
      return { success: true };
    } catch (error) {
      console.error("Connection test failed:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  // Test method to verify database schema
  async testSchema(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log("=== Testing Database Schema ===");
      
      // Test 1: Check if required tables exist
      console.log("Checking if required tables exist...");
      
      const requiredTables = ['profiles', 'polls', 'poll_options', 'votes', 'vote_options'];
      const missingTables = [];
      
      for (const tableName of requiredTables) {
        try {
          const { error } = await this.supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (error && error.code === '42P01') { // relation does not exist
            missingTables.push(tableName);
          }
        } catch (err) {
          console.error(`Error checking table ${tableName}:`, err);
        }
      }
      
      if (missingTables.length > 0) {
        const errorMsg = `Missing tables: ${missingTables.join(', ')}`;
        console.error(errorMsg);
        return { 
          success: false, 
          error: errorMsg,
          details: { missingTables }
        };
      }
      
      console.log("All required tables exist");
      
      // Test 2: Check table structure
      console.log("Checking table structure...");
      
      // Test profiles table structure
      const { error: profilesError } = await this.supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .limit(1);
      
      if (profilesError) {
        console.error("Profiles table structure error:", profilesError);
        return { 
          success: false, 
          error: `Profiles table structure error: ${profilesError.message}`,
          details: profilesError
        };
      }
      
      // Test polls table structure
      const { error: pollsError } = await this.supabase
        .from("polls")
        .select("id, title, author_id, status, vote_type, created_at")
        .limit(1);
      
      if (pollsError) {
        console.error("Polls table structure error:", pollsError);
        return { 
          success: false, 
          error: `Polls table structure error: ${pollsError.message}`,
          details: pollsError
        };
      }
      
      // Test poll_options table structure
      const { error: optionsError } = await this.supabase
        .from("poll_options")
        .select("id, poll_id, text, order_index, created_at")
        .limit(1);
      
      if (optionsError) {
        console.error("Poll options table structure error:", optionsError);
        return { 
          success: false, 
          error: `Poll options table structure error: ${optionsError.message}`,
          details: optionsError
        };
      }
      
      console.log("All table structures are correct");
      console.log("=== Schema Test Passed ===");
      return { success: true };
    } catch (error) {
      console.error("Schema test failed:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        details: error
      };
    }
  }
}

export const pollService = new PollService();
export default pollService;
