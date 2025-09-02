import CreatePollForm from "@/components/forms/CreatePollForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/polls">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Polls
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
          <p className="text-gray-600 mt-2">
            Share your question with the community and get valuable insights
          </p>
        </div>

        {/* Form */}
        <CreatePollForm />

        {/* Tips */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            Tips for creating great polls:
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• Keep your question clear and concise</li>
            <li>• Provide balanced and relevant options</li>
            <li>• Add context when needed to help voters understand</li>
            <li>
              • Consider setting an expiration date for time-sensitive questions
            </li>
            <li>
              • Use multiple choice when you want to allow multiple selections
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
