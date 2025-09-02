"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";

export default function CreatePollForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: ["", ""],
    isMultipleChoice: false,
    expiresAt: "",
  });

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index),
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement poll creation logic
    console.log("Creating poll:", formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Share your question with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              placeholder="What would you like to ask?"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more context to your poll..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Poll Options</Label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
                {formData.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full"
            >
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expires At (Optional)</Label>
            <Input
              id="expiresAt"
              type="datetime-local"
              value={formData.expiresAt}
              onChange={(e) =>
                setFormData({ ...formData, expiresAt: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isMultipleChoice"
              checked={formData.isMultipleChoice}
              onChange={(e) =>
                setFormData({ ...formData, isMultipleChoice: e.target.checked })
              }
              className="rounded"
            />
            <Label htmlFor="isMultipleChoice">
              Allow multiple choice selection
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Create Poll
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
