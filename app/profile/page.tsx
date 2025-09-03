"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, AlertCircle, User, Mail, Calendar, Edit, Save, X } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { pollService } from "@/lib/db/pollService";
import { PollWithOptions } from "@/lib/types/poll";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userPolls, setUserPolls] = useState<PollWithOptions[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.name || "",
        bio: user.user_metadata?.bio || "",
      });
      fetchUserPolls();
    }
  }, [user]);

  const fetchUserPolls = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const polls = await pollService.getUserPolls(user.id);
      setUserPolls(polls);
    } catch (error) {
      console.error("Error fetching user polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      
      const result = await updateProfile({ name: formData.name });
      
      if (result?.error) {
        setError(result.error.message || "Failed to update profile");
      } else {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.user_metadata?.name || "",
      bio: user?.user_metadata?.bio || "",
    });
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

          {/* Success/Error Messages */}
          {success && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700">{success}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Account Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your personal profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  {!isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Display Name</p>
                        <p className="text-sm text-gray-600">
                          {formData.name || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bio</p>
                        <p className="text-sm text-gray-600">
                          {formData.bio || 'No bio added yet'}
                        </p>
                      </div>
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="w-full"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your display name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Tell us about yourself"
                          rows={3}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="flex-1"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={handleCancelEdit}
                          variant="outline"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* User Statistics and Polls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Polling Statistics</CardTitle>
                  <CardDescription>
                    Overview of your polling activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{userPolls.length}</p>
                      <p className="text-sm text-blue-600">Polls Created</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {userPolls.reduce((sum, poll) => sum + (poll.total_votes || 0), 0)}
                      </p>
                      <p className="text-sm text-green-600">Total Votes</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {userPolls.filter(poll => poll.status === 'active').length}
                      </p>
                      <p className="text-sm text-purple-600">Active Polls</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {userPolls.filter(poll => poll.status === 'closed').length}
                      </p>
                      <p className="text-sm text-orange-600">Closed Polls</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Polls */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Polls</CardTitle>
                  <CardDescription>
                    Latest polls you've created
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" />
                      <p className="text-gray-600 mt-2">Loading your polls...</p>
                    </div>
                  ) : userPolls.length > 0 ? (
                    <div className="space-y-3">
                      {userPolls.slice(0, 5).map((poll) => (
                        <div key={poll.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{poll.title}</h4>
                            <p className="text-sm text-gray-600">
                              Created {formatDate(poll.created_at)} • {poll.total_votes} votes
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              poll.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : poll.status === 'closed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {poll.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {userPolls.length > 5 && (
                        <p className="text-center text-sm text-gray-600">
                          And {userPolls.length - 5} more polls...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">You haven't created any polls yet.</p>
                      <Button asChild>
                        <a href="/polls/create">Create Your First Poll</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
