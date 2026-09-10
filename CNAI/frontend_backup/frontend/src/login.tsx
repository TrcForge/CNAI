import { useState } from 'react'
import type { FormEvent } from 'react'

type Role = 'ADMIN' | 'INVESTIGATOR' | 'ANALYST' | 'VIEWER'

type LoginResponse = {
  access_token: string
  token_type?: string
  user: {
    id: string
    username: string
    role: Role
    name?: string
  }
}

type LoginProps = {
  onLoginSuccess: (response: LoginResponse) => void
}

type TestUser = {
  password: string
  role: Role
  name: string
}

const testUsers: Record<string, TestUser> = {
  admin01: {
    password: 'Admin@123',
    role: 'ADMIN',
    name: 'System Administrator',
  },
  investigator01: {
    password: 'Investigator@123',
    role: 'INVESTIGATOR',
    name: 'Investigator',
  },
  analyst01: {
    password: 'Analyst@123',
    role: 'ANALYST',
    name: 'Security Analyst',
  },
  viewer01: {
    password: 'Viewer@123',
    role: 'VIEWER',
    name: 'Authorized Viewer',
  },
}

function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedUsername = username.trim()

    if (!trimmedUsername) {
      setError('Username is required.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Temporary authentication for frontend testing.
      // This will be replaced with the real FastAPI API.
      await new Promise((resolve) => setTimeout(resolve, 700))

      const user = testUsers[trimmedUsername]

      if (!user || user.password !== password) {
        throw new Error('Invalid username or password.')
      }

      const loginResponse: LoginResponse = {
        access_token: `dev-token-${user.role.toLowerCase()}`,
        token_type: 'bearer',
        user: {
          id: `DEV-${user.role}`,
          username: trimmedUsername,
          role: user.role,
          name: user.name,
        },
      }

      onLoginSuccess(loginResponse)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Authentication failed.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <section
          aria-labelledby="login-title"
          className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="grid min-h-[620px] md:grid-cols-[1.05fr_0.95fr]">

            {/* Security information panel */}
            <div className="relative hidden overflow-hidden bg-[#08264a] p-10 text-white md:flex md:flex-col md:justify-between">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-300/10" />
              <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-blue-300/10" />

              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200/20 bg-blue-500/20">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-7 w-7"
                      aria-hidden="true"
                    >
                      <path d="M12 3l7 3v5c0 4.5-2.9 8.5-7 10-4.1-1.5-7-5.5-7-10V6l7-3z" />
                      <path d="M9.5 12l1.7 1.7 3.8-4" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                      Secure Access
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      Intelligence Operations
                    </p>
                  </div>
                </div>

                <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
                  Criminal Network Analysis
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-blue-100/80">
                  Secure investigator access for authorized criminal network
                  analysis, intelligence correlation and women safety
                  investigations.
                </p>

                <div className="mt-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        Authorized Access
                      </p>
                      <p className="text-xs text-blue-100/60">
                        Role-based system permissions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path d="M12 3l7 4v5c0 4.2-2.8 7.9-7 9-4.2-1.1-7-4.8-7-9V7l7-4z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold">
                        Protected Environment
                      </p>
                      <p className="text-xs text-blue-100/60">
                        Investigative data access is monitored
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 border-t border-white/10 pt-5">
                <p className="text-xs leading-5 text-blue-100/60">
                  Authorized personnel only. All access and investigative
                  activity may be subject to audit and monitoring.
                </p>
              </div>
            </div>

            {/* Login panel */}
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <div className="mx-auto w-full max-w-md">

                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-white shadow-md md:hidden">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-6 w-6"
                      aria-hidden="true"
                    >
                      <path d="M12 3l7 3v5c0 4.5-2.9 8.5-7 10-4.1-1.5-7-5.5-7-10V6l7-3z" />
                      <path d="M9.5 12l1.7 1.7 3.8-4" />
                    </svg>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                    Investigator Portal
                  </p>

                  <h1
                    id="login-title"
                    className="mt-2 text-3xl font-bold tracking-tight text-slate-900"
                  >
                    Sign in
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter your authorized credentials to access the
                    intelligence platform.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                >
                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Username
                    </label>

                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value)
                        if (error) setError('')
                      }}
                      autoComplete="username"
                      autoFocus
                      placeholder="Enter your username"
                      disabled={loading}
                      aria-invalid={Boolean(error)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value)
                          if (error) setError('')
                        }}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        disabled={loading}
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-xs font-semibold text-blue-700 outline-none transition hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mt-0.5 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v5" />
                        <path d="M12 16h.01" />
                      </svg>

                      <span>{error}</span>
                    </div>
                  )}

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-bold text-white shadow-md outline-none transition hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                          aria-hidden="true"
                        />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="M13 6l6 6-6 6" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {/* Security notice */}
                <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                  <div className="flex gap-3">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="mt-0.5 h-5 w-5 shrink-0 text-blue-700"
                      aria-hidden="true"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                      />
                      <path d="M8 10V7a4 4 0 018 0v3" />
                    </svg>

                    <div>
                      <p className="text-xs font-bold text-blue-900">
                        Secure access
                      </p>
                      <p className="mt-1 text-xs leading-5 text-blue-800/70">
                        Access is restricted to authorized personnel.
                        Authentication and access activity may be recorded
                        for security auditing.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                  Criminal Intelligence & Women Safety Platform
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login