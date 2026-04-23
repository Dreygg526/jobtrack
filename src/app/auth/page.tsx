'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
<div className="hidden lg:flex w-1/2 flex-col items-center justify-center px-12 relative"
  style={{
    backgroundImage: "url('/hero.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
  {/* Dark overlay */}
  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(45, 62, 80, 0.85)' }} />
  
  {/* Content on top of overlay */}
  <div className="relative z-10 flex flex-col items-center">
    <h1 className="text-5xl font-bold text-white mb-4">JobTrack</h1>
    <p className="text-lg text-center" style={{ color: '#6dbfb8' }}>
      Track your job applications with ease
    </p>
    <div className="mt-12 grid grid-cols-1 gap-6 w-full max-w-sm">
      {[
        { icon: '📋', title: 'Kanban Pipeline', desc: 'Visualize your job hunt' },
        { icon: '📊', title: 'Live Stats', desc: 'Track your offer rate' },
        { icon: '🔒', title: 'Secure & Private', desc: 'Your data stays yours' },
      ].map(f => (
        <div key={f.title} className="flex items-center gap-4 p-4 rounded-xl"
          style={{ backgroundColor: 'rgba(26, 38, 52, 0.7)' }}>
          <span className="text-2xl">{f.icon}</span>
          <div>
            <p className="font-semibold text-white text-sm">{f.title}</p>
            <p className="text-xs" style={{ color: '#6dbfb8' }}>{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-8"
        style={{ backgroundColor: '#f5f7fa' }}>
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#2d3e50' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm mb-6 text-slate-400">
              {isSignUp ? 'Sign up to start tracking' : 'Sign in to your account'}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 pr-16"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                    style={{ color: '#6dbfb8' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#6dbfb8' }}
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm mt-4"
              style={{ color: '#2d3e50' }}
            >
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <span className="font-semibold" style={{ color: '#6dbfb8' }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}