'use client'

import { useState } from 'react'

interface LoginProps {
  onLogin: (role: string, username: string, password: string) => Promise<{ success: boolean; message?: string }>
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState('manager')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (role !== 'manager' && !username.trim()) {
      setError('请输入姓名')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('请输入密码')
      setLoading(false)
      return
    }

    const result = await onLogin(role, username, password)
    if (!result.success) {
      setError(result.message || '登录失败')
    }
    setLoading(false)
  }

  const getRoleButtonColor = () => {
    switch (role) {
      case 'manager': return 'bg-indigo-600 text-white'
      case 'teacher': return 'bg-emerald-600 text-white'
      case 'student': return 'bg-amber-600 text-white'
      default: return 'bg-slate-600 text-white'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-950">
            COCO 留学管理后台
          </h2>
          <p className="mt-2 text-center text-xs text-slate-500">
            请选择您的角色并登录系统
          </p>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setRole('manager')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${role === 'manager' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg> 管理人
          </button>
          <button
            onClick={() => setRole('teacher')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${role === 'teacher' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg> 合作老师
          </button>
          <button
            onClick={() => setRole('student')}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all duration-150 ${role === 'student' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg> 学生
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            {role !== 'manager' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {role === 'teacher' ? '老师姓名' : '学生姓名'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'teacher' ? '请输入您的老师姓名' : '请输入您的学生姓名'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                登录密码 {role === 'manager' && <span className="text-[10px] text-slate-400 font-normal">(6位分配密码)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入登录密码"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 text-sm font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 shadow-md ${getRoleButtonColor()} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white/50 group-hover:text-white/80 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </span>
              {loading ? '登录中...' : '确认安全登录'}
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <details className="group">
            <summary className="list-none flex justify-between items-center text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
              <span>
                <svg className="w-3 h-3 inline mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg> 快捷测试账号密码本
              </span>
              <svg className="w-3 h-3 text-[10px] group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 space-y-2 font-mono">
              <div>🔑 <strong className="text-indigo-600">工作室管理人</strong>: 密码 <span className="bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded">920101</span></div>
              <div>👨‍🏫 <strong className="text-emerald-600">合作老师</strong> (输入老师姓名):
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>王老师 | 密码: <span className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">111111</span></li>
                  <li>李老师 | 密码: <span className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">222222</span></li>
                </ul>
              </div>
              <div>🎓 <strong className="text-amber-600">学 生</strong> (输入学生姓名):
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  <li>张伟 | 密码: <span className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">888888</span></li>
                  <li>李娜 | 密码: <span className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded">999999</span></li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
