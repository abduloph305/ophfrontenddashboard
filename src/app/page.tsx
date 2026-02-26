import Link from "next/link";
import { ArrowRight, Mail, Users, BarChart3, Shield, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header/Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
              EM
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              E-Marketing
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white -z-10" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">New: AI Segment Suggester</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
            Grow your audience with <br />
            <span className="text-indigo-600">Precision Emailing</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            The all-in-one platform to create, send, and scale your email marketing. 
            Automate segments, track analytics, and build beautiful templates in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-[1.02] transition-all"
            >
              Start for Free
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              View Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 border-t border-slate-100 max-w-4xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale transition hover:grayscale-0">
            <div className="flex items-center gap-2 font-bold text-slate-400">Trusted By 2000+ Brands</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to succeed</h2>
            <p className="text-slate-600">Powerful tools designed for teams of any size.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mail className="text-indigo-600" />}
              title="Powerful Builder"
              description="Drag-and-drop your way to beautiful emails. No coding required."
            />
            <FeatureCard 
              icon={<Users className="text-purple-600" />}
              title="Smart Segments"
              description="Filter your audience with advanced logic to send targeted messages."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-blue-600" />}
              title="Real-time Stats"
              description="Monitor opens, clicks, and conversion rates as they happen."
            />
            <FeatureCard 
              icon={<Zap className="text-amber-500" />}
              title="Bulk Sending"
              description="Lightning-fast delivery even to the largest subscriber lists."
            />
            <FeatureCard 
              icon={<Shield className="text-green-600" />}
              title="Safe & Secure"
              description="Enterprise-grade security and GDPR compliant data management."
            />
            <FeatureCard 
              icon={<Globe className="text-cyan-600" />}
              title="Timezone Sync"
              description="Send emails at the perfect time for every subscriber globally."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 E-Marketing Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
