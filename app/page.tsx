import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BarChart3, Users, TrendingUp, Zap, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <BarChart3 className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Create, Share, and <span className="text-blue-600">Vote</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AlxPolly is a modern polling platform that makes it easy to gather
              opinions, make decisions, and engage with your community through
              interactive polls.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/polls/create">
                <Button size="lg" className="text-lg px-8 py-3">
                  Create Your First Poll
                </Button>
              </Link>
              <Link href="/polls">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3"
                >
                  Browse Polls
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AlxPolly?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make polling simple, engaging, and
              insightful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-gray-600">
                  Create polls in seconds with our intuitive interface and
                  instant sharing capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Community Driven
                </h3>
                <p className="text-gray-600">
                  Engage with your audience through interactive polls and
                  real-time results.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-gray-600">
                  Track responses and visualize results with beautiful charts
                  and insights.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Secure & Private
                </h3>
                <p className="text-gray-600">
                  Your data is protected with enterprise-grade security and
                  privacy controls.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Global Reach
                </h3>
                <p className="text-gray-600">
                  Share polls worldwide and gather diverse perspectives from
                  around the globe.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 bg-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Advanced Polling
                </h3>
                <p className="text-gray-600">
                  Support for multiple choice, ranked voting, and custom
                  expiration dates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already creating engaging polls and
            gathering valuable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="default" className="text-lg px-8 py-3">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/polls">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900"
              >
                Explore Polls
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">AlxPolly</span>
              </div>
              <p className="text-gray-400">
                Empowering communities through interactive polling and
                decision-making.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/polls" className="hover:text-white">
                    Browse Polls
                  </Link>
                </li>
                <li>
                  <Link href="/polls/create" className="hover:text-white">
                    Create Poll
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-white">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AlxPolly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
