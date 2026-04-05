import Link from "next/link";
import { Sparkles, Kanban, Shield, GitBranch, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const features = [
    { icon: Kanban, title: "Kanban Boards", desc: "Drag-and-drop tasks across columns with real-time updates and optimistic UI." },
    { icon: Sparkles, title: "AI Assistant", desc: "Generate task descriptions and get priority suggestions with one click." },
    { icon: Shield, title: "Secure by Design", desc: "JWT auth, input validation, role-based access, and encrypted passwords." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" /> AI-Powered Task Management
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Manage Projects<br />
          <span className="text-indigo-600">Smarter, Not Harder</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          TaskFlow combines Kanban boards with AI to help you organize tasks,
          generate descriptions, and prioritize work — all in a beautiful, fast interface.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 text-base">
              Start Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">Why TaskFlow?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="text-center p-6 rounded-xl border hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Built by <strong>Bhargavi Chella</strong> &middot; TaskFlow &copy; {new Date().getFullYear()}
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/bhargavi35" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
              <GitBranch className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/in/bhargavichella/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
              <Link2 className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
