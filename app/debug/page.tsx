"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pollService } from "@/lib/db/pollService";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function DebugPage() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<{
    connection: { success: boolean; error?: string } | null;
    schema: { success: boolean; error?: string; details?: any } | null;
    createPoll: { success: boolean; error?: string } | null;
  }>({
    connection: null,
    schema: null,
    createPoll: null,
  });
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await pollService.testConnection();
      setTestResults(prev => ({ ...prev, connection: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        connection: { 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const testSchema = async () => {
    setLoading(true);
    try {
      const result = await pollService.testSchema();
      setTestResults(prev => ({ ...prev, schema: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        schema: { 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const testCreatePoll = async () => {
    if (!user) {
      setTestResults(prev => ({ 
        ...prev, 
        createPoll: { 
          success: false, 
          error: "User not authenticated" 
        } 
      }));
      return;
    }

    setLoading(true);
    try {
      console.log("=== Starting Create Poll Test ===");
      console.log("User ID:", user.id);
      console.log("User email:", user.email);
      
      const testPollData = {
        title: "Debug Test Poll",
        description: "This is a test poll for debugging",
        options: ["Option 1", "Option 2"],
        vote_type: "single" as const,
        category: "Debug",
      };

      console.log("Test poll data:", testPollData);
      console.log("Calling pollService.createPoll...");

      const result = await pollService.createPoll(testPollData, user.id);
      
      console.log("Poll created successfully:", result);
      setTestResults(prev => ({ 
        ...prev, 
        createPoll: { success: true, error: undefined } 
      }));
      
      // Clean up the test poll
      try {
        console.log("Cleaning up test poll...");
        await pollService.deletePoll(result.id, user.id);
        console.log("Test poll cleaned up successfully");
      } catch (cleanupError) {
        console.error("Failed to cleanup test poll:", cleanupError);
      }
    } catch (error) {
      console.error("=== Create Poll Test Failed ===");
      console.error("Error details:", error);
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error?.constructor?.name);
      
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
      let errorMessage = "Failed to create poll";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as any).message);
      }
      
      setTestResults(prev => ({ 
        ...prev, 
        createPoll: { 
          success: false, 
          error: errorMessage 
        } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    await testConnection();
    await testSchema();
    await testCreatePoll();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Connection Test</CardTitle>
              <CardDescription>Test basic database connectivity</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testConnection} 
                disabled={loading}
                className="w-full mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
              
              {testResults.connection && (
                <div className={`flex items-center space-x-2 p-3 rounded-md ${
                  testResults.connection.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {testResults.connection.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${
                    testResults.connection.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {testResults.connection.success 
                      ? 'Connection successful' 
                      : testResults.connection.error}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schema Test</CardTitle>
              <CardDescription>Test database table structure</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testSchema} 
                disabled={loading}
                className="w-full mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Schema"
                )}
              </Button>
              
              {testResults.schema && (
                <div className={`flex items-center space-x-2 p-3 rounded-md ${
                  testResults.schema.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {testResults.schema.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${
                    testResults.schema.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {testResults.schema.success 
                      ? 'Schema valid' 
                      : testResults.schema.error}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Poll Test</CardTitle>
              <CardDescription>Test poll creation functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testCreatePoll} 
                disabled={loading || !user}
                className="w-full mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Create Poll"
                )}
              </Button>
              
              {!user && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Please log in to test poll creation
                  </span>
                </div>
              )}
              
              {testResults.createPoll && (
                <div className={`flex items-center space-x-2 p-3 rounded-md ${
                  testResults.createPoll.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {testResults.createPoll.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${
                    testResults.createPoll.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {testResults.createPoll.success 
                      ? 'Poll creation successful' 
                      : testResults.createPoll.error}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Run All Tests</CardTitle>
            <CardDescription>Execute all tests at once</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runAllTests} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                "Run All Tests"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>User Status:</strong> {user ? 'Authenticated' : 'Not authenticated'}
              </div>
              {user && (
                <div>
                  <strong>User ID:</strong> {user.id}
                </div>
              )}
              <div>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </div>
              <div>
                <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}
              </div>
              <div>
                <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
