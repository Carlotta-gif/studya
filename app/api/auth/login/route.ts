import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { role, username, password } = await request.json()

    if (!role || !username || !password) {
      return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 })
    }

    if (role === 'manager') {
      if (password === process.env.MANAGER_PASSWORD) {
        return NextResponse.json({
          success: true,
          user: { name: '管理员', role: 'manager' },
        })
      }
      return NextResponse.json({ success: false, message: '密码错误' }, { status: 401 })
    }

    if (role === 'teacher') {
      const teacher = await prisma.teacher.findUnique({ where: { name: username } })
      if (!teacher) {
        return NextResponse.json({ success: false, message: '老师不存在' }, { status: 404 })
      }
      if (bcrypt.compareSync(password, teacher.password)) {
        return NextResponse.json({
          success: true,
          user: { name: teacher.name, role: 'teacher', id: teacher.id },
        })
      }
      return NextResponse.json({ success: false, message: '密码错误' }, { status: 401 })
    }

    if (role === 'student') {
      const student = await prisma.student.findUnique({ where: { name: username } })
      if (!student) {
        return NextResponse.json({ success: false, message: '学生不存在' }, { status: 404 })
      }
      if (bcrypt.compareSync(password, student.password)) {
        return NextResponse.json({
          success: true,
          user: { name: student.name, role: 'student', id: student.id },
        })
      }
      return NextResponse.json({ success: false, message: '密码错误' }, { status: 401 })
    }

    return NextResponse.json({ success: false, message: '无效角色' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
