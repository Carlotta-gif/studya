'use client'

import { useState, useEffect, useMemo } from 'react'

interface User {
  name: string
  role: 'manager' | 'teacher' | 'student'
  id?: string
}

interface Student {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: string
}

interface Teacher {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: string
}

interface Task {
  id: string
  type: string
  typeName: string
  teacherId?: string
  teacher?: Teacher
  fileUrl?: string
  fileName?: string
  settlement?: number
  isSettled: boolean
  voucherUrl?: string
  applicationId: string
}

interface Application {
  id: string
  projectName: string
  ddl: string
  studentId: string
  student: Student
  tasks: Task[]
  createdAt: string
}

interface DashboardProps {
  user: User | null
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  
  const [filters, setFilters] = useState({
    studentName: '',
    projectName: '',
    ddlMax: '',
    daysLeftMax: '',
    teacherName: '',
  })

  // Redirect if user is null
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">加载中...</div>
      </div>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [studentsRes, teachersRes, applicationsRes] = await Promise.all([
          fetch('/api/students'),
          fetch(`/api/applications${user.role === 'student' && user.id ? `?studentId=${user.id}` : user.role === 'teacher' && user.id ? `?teacherId=${user.id}` : ''}`),
          fetch('/api/teachers'),
        ])
      
      const studentsData = await studentsRes.json()
      const teachersData = await teachersRes.json()
      const applicationsData = await applicationsRes.json()
      
      if (studentsData.success) setStudents(studentsData.data)
      if (teachersData.success) setApplications(teachersData.data)
      if (applicationsData.success) setTeachers(applicationsData.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
      setLoading(false)
    }
    fetchData()
  }, [user.role, user.id])

  const getDaysLeft = (ddl: string) => {
    const today = new Date()
    const deadline = new Date(ddl)
    const diff = deadline.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const isUrgent = (ddl: string) => {
    return getDaysLeft(ddl) <= 7
  }

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      if (filters.studentName && !app.student.name.includes(filters.studentName)) return false
      if (filters.projectName && !app.projectName.includes(filters.projectName)) return false
      if (filters.ddlMax && app.ddl > filters.ddlMax) return false
      if (filters.daysLeftMax && getDaysLeft(app.ddl) > Number(filters.daysLeftMax)) return false
      if (filters.teacherName && !app.tasks.some(t => t.teacher?.name.includes(filters.teacherName))) return false
      return true
    })
  }, [applications, filters])

  const getTaskBadgeColor = (type: string) => {
    switch (type) {
      case 'personal': return 'bg-indigo-500'
      case 'recommendation': return 'bg-emerald-500'
      case 'cv': return 'bg-amber-500'
      default: return 'bg-slate-500'
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({ studentName: '', projectName: '', ddlMax: '', daysLeftMax: '', teacherName: '' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-md shadow-indigo-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">COCO 留学管理后台</h1>
              <p className="text-xs text-slate-400">申请进程与协作结算平台</p>
            </div>
          </div>

          <div className="bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs text-slate-300">
            <svg className="w-3 h-3 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            日期: <span className="font-semibold text-indigo-400">{new Date().toLocaleDateString('zh-CN')}</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-1.5 px-3 rounded-xl border border-slate-700">
            <div className="text-xs">
              <span className="text-slate-400">当前登录: </span>
              <span className={`font-bold ${user.role === 'manager' ? 'text-indigo-400' : user.role === 'teacher' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {user.name}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <button onClick={onLogout} className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg> 退出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {user.role === 'manager' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">在管学生人数</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">{students.length}</h3>
              </div>
              <div className="bg-blue-50 text-blue-600 p-4 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">紧急跟踪项目 (≤7天)</p>
                <h3 className="text-2xl font-bold mt-1 text-rose-600">{applications.filter(a => isUrgent(a.ddl)).length}</h3>
              </div>
              <div className="bg-rose-50 text-rose-600 p-4 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">文书交付进度</p>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600">
                  {applications.reduce((acc, app) => acc + app.tasks.filter(t => t.fileUrl).length, 0)}/{applications.reduce((acc, app) => acc + app.tasks.length, 0)}
                </h3>
              </div>
              <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">应付老师总额 (未结算)</p>
                <h3 className="text-2xl font-bold mt-1 text-indigo-600">
                  ¥{applications.reduce((acc, app) => acc + app.tasks.filter(t => !t.isSettled).reduce((sum, t) => sum + (t.settlement || 0), 0), 0)}
                </h3>
              </div>
              <div className="bg-indigo-50 text-indigo-600 p-4 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {user.role === 'manager' && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              申请进程看板
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <button className="bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm py-2 px-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-150 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg> 管理学生
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm py-2 px-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-150 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg> 管理合作老师
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2 px-4 rounded-xl shadow-md shadow-indigo-500/10 transition-all duration-150 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg> 新建申请项目
              </button>
            </div>
          </div>
        )}

        {user.role !== 'manager' && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              申请项目一览表 <span className="text-xs font-normal text-slate-400">
                {user.role === 'student' ? '(仅展示您本人的申请与交付文档)' : '(仅展示分配给您的文书撰写任务)'}
              </span>
            </h2>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-50 text-indigo-600 w-7 h-7 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800">申请看板条件筛选器</h3>
            </div>
            <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-indigo-600 font-semibold transition-colors flex items-center gap-1.5 self-end sm:self-auto bg-slate-50 hover:bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-slate-100">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg> 重置所有筛选
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">学生姓名</label>
              <input
                type="text"
                value={filters.studentName}
                onChange={(e) => handleFilterChange('studentName', e.target.value)}
                disabled={user.role === 'student'}
                placeholder="输入学生姓名筛选"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">目标院校项目</label>
              <input
                type="text"
                value={filters.projectName}
                onChange={(e) => handleFilterChange('projectName', e.target.value)}
                placeholder="搜索学校/项目关键字..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">截止日期不晚于</label>
              <input
                type="date"
                value={filters.ddlMax}
                onChange={(e) => handleFilterChange('ddlMax', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                剩余截止倒计时 ≤ <span className="font-bold text-indigo-600">{filters.daysLeftMax || '∞'}</span> 天
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={filters.daysLeftMax}
                  onChange={(e) => handleFilterChange('daysLeftMax', e.target.value)}
                  className="flex-grow h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                {filters.daysLeftMax && (
                  <button onClick={() => handleFilterChange('daysLeftMax', '')} className="text-[10px] text-slate-400 hover:text-rose-500 font-bold">清除</button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">主导/负责老师</label>
              <input
                type="text"
                value={filters.teacherName}
                onChange={(e) => handleFilterChange('teacherName', e.target.value)}
                disabled={user.role === 'teacher'}
                placeholder="输入老师姓名筛选"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 text-slate-500 text-xs font-semibold border-b border-slate-100">
                  <th className="py-4 px-6">学生姓名</th>
                  <th className="py-4 px-6">申请项目</th>
                  <th className="py-4 px-6">申请截止日期 (DDL)</th>
                  <th className="py-4 px-6">倒计时 / 状态</th>
                  <th className="py-4 px-6" style={{ minWidth: '520px' }}>任务文档协作区 (个人文书 / 推荐信 / CV简历)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors duration-150" >
                    <td className="py-5 px-6">
                      <div className="font-semibold text-slate-800">{app.student.name}</div>
                    </td>

                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-slate-800">{app.projectName}</div>
                        {user.role === 'manager' && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1.5 ml-2">
                              <span className="text-slate-200">|</span>
                              <button className="text-indigo-600 hover:text-indigo-800 text-[11px] font-medium flex items-center gap-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg> 编辑
                              </button>
                              <span className="text-slate-200">|</span>
                              <button className="text-rose-600 hover:text-rose-800 text-[11px] font-medium flex items-center gap-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg> 删除
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-5 px-6">
                      <div className="font-mono text-sm text-slate-700">{app.ddl}</div>
                    </td>

                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1.5">
                        {isUrgent(app.ddl) ? (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200 w-fit animate-pulse">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg> 🚨紧急
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-200 w-fit">
                            正常追踪
                          </span>
                        )}
                        <div className="text-xs text-slate-500 font-medium">
                          剩 <span className={`font-bold text-sm ${isUrgent(app.ddl) ? 'text-rose-600' : 'text-slate-700'}`}>{getDaysLeft(app.ddl)}</span> 天截止
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-6">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2.5">
                        {app.tasks.map(task => (
                          <div key={task.id} className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-slate-100 hover:shadow-sm transition-shadow duration-150">
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <span className={`w-1.5 h-3.5 rounded-full ${getTaskBadgeColor(task.type)}`}></span>
                              <span className="text-xs font-semibold text-slate-700">{task.typeName}</span>
                            </div>

                            <div className="text-xs text-slate-600 flex items-center gap-1.5 min-w-[130px]">
                              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {user.role === 'manager' ? (
                                <select
                                  value={task.teacherId || ''}
                                  onChange={(e) => console.log('Update teacher:', e.target.value)}
                                  className="bg-slate-50 border border-slate-200 text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-indigo-500 transition-colors w-full"
                                >
                                  <option value="">选择老师</option>
                                  {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="font-medium text-slate-700">{task.teacher?.name || '待分配'}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-grow justify-end">
                              {task.fileUrl ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-medium max-w-[120px] truncate" title={task.fileName}>
                                    {task.fileName}
                                  </span>
                                  <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium hover:underline flex items-center gap-0.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg> 预览
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg> 待上传
                                </span>
                              )}

                              {(user.role === 'manager' || (user.role === 'teacher' && task.teacherId === user.id)) && (
                                <div className="ml-1">
                                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1">
                                    <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    {task.fileUrl ? '更新' : '上传PDF'}
                                  </label>
                                  <input type="file" accept="application/pdf" className="hidden" />
                                </div>
                              )}
                            </div>

                            {(user.role === 'manager' || (user.role === 'teacher' && task.teacherId === user.id)) && (
                              <div className="flex items-center flex-wrap md:flex-nowrap gap-3 border-l border-slate-200 pl-3 ml-1 min-w-[290px] justify-end">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-slate-400">💰 费用:</span>
                                  {user.role === 'manager' ? (
                                    <div className="relative flex items-center">
                                      <span className="absolute left-1.5 text-[10px] text-slate-400">¥</span>
                                      <input
                                        type="number"
                                        value={task.settlement || 0}
                                        onChange={(e) => console.log('Update settlement:', e.target.value)}
                                        className="w-14 bg-slate-50 border border-slate-200 text-xs rounded-md pl-4 pr-1 py-1 text-right focus:outline-none focus:border-indigo-500 focus:bg-white font-mono font-medium"
                                      />
                                    </div>
                                  ) : (
                                    <span className="font-mono font-semibold text-xs text-slate-700">¥{task.settlement || 0}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-slate-400">结算:</span>
                                  {user.role === 'manager' ? (
                                    <select
                                      value={task.isSettled ? 'yes' : 'no'}
                                      onChange={(e) => console.log('Update settlement status:', e.target.value)}
                                      className={`bg-slate-50 border text-[11px] rounded-md px-1.5 py-0.5 focus:outline-none font-medium transition-colors ${task.isSettled ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-slate-200 text-slate-600'}`}
                                    >
                                      <option value="no">否</option>
                                      <option value="yes">是</option>
                                    </select>
                                  ) : (
                                    <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-semibold ${task.isSettled ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                      {task.isSettled ? '已结' : '未结'}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 min-w-[75px] justify-end">
                                  {task.voucherUrl ? (
                                    <button className="text-emerald-600 hover:text-emerald-700 text-[11px] font-semibold flex items-center gap-0.5 bg-emerald-50 hover:bg-emerald-100/50 px-1 py-0.5 rounded transition-colors">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg> 凭证
                                    </button>
                                  ) : user.role === 'manager' ? (
                                    <div>
                                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 px-1 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-0.5">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg> 传图
                                      </label>
                                      <input type="file" accept="image/*" className="hidden" />
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
