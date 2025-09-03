"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PollWithOptions } from "@/lib/types/poll";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface PollCardProps {
  poll: PollWithOptions;
  onVote?: (pollId: string, optionIds: string[]) => void;
  onView?: (pollId: string) => void;
  onEdit?: (pollId: string) => void;
  onDelete?: (pollId: string) => void;
}

export default function PollCard({ poll, onVote, onView, onEdit, onDelete }: PollCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isOwner = user?.id === poll.author_id;

  const handleVote = (optionIds: string[]) => {
    if (onVote) {
      onVote(poll.id, optionIds);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(poll.id);
    } else {
      router.push(`/polls/${poll.id}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(poll.id);
    } else {
      router.push(`/polls/${poll.id}/edit`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(poll.id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Active" },
      closed: { color: "bg-red-100 text-red-800", text: "Closed" },
      draft: { color: "bg-gray-100 text-gray-800", text: "Draft" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getVoteTypeLabel = (voteType: string) => {
    return voteType === "multiple" ? "Multiple Choice" : "Single Choice";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-sm text-gray-600 mb-3">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {getStatusBadge(poll.status)}
            <Badge variant="outline" className="text-xs">
              {getVoteTypeLabel(poll.vote_type)}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>{poll.total_votes} votes</span>
            {poll.category && <span>• {poll.category}</span>}
            {poll.is_anonymous ? (
              <span>• Anonymous</span>
            ) : (
              <span>• by {poll.author?.full_name || poll.author?.email}</span>
            )}
          </div>
          <span>{formatDate(poll.created_at)}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 mb-4">
          {poll.options.slice(0, 3).map((option) => (
            <div key={option.id} className="text-sm text-gray-700">
              • {option.text}
            </div>
          ))}
          {poll.options.length > 3 && (
            <div className="text-sm text-gray-500">
              +{poll.options.length - 3} more options
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="text-blue-600 hover:text-blue-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="text-green-600 hover:text-green-700"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
          
          {poll.expires_at && (
            <div className="text-xs text-gray-500">
              Expires {formatDate(poll.expires_at)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
