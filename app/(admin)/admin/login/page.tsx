'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Link2, Lock, User, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok) {
        // --- SMART REDIRECT LOGIC ---
        if (data.role === 'EMPLOYEE') {
           router.push('/admin/blog')
        } else {
           router.push('/admin/dashboard')
        }
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-slate-50 -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md px-4">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MinifyLinks</h1>
          <p className="text-sm text-slate-500 font-medium">Internal Workspace</p>
        </div>

        <Card className="shadow-xl border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pt-8 pb-4 text-center">
            <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500">
              Enter your credentials to manage links & content.
            </p>
          </CardHeader>
          
          <CardContent className="pb-8 px-8">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <Input 
                    type="text"
                    placeholder="Enter your username"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  />
                </div>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <ShieldCheck className="w-4 h-4" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11 shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Authorized personnel only. <br/> IP address is logged for security.
        </p>
      </div>
    </div>
  )
}