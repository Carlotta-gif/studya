import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    })
    return NextResponse.json({ success: true, data: teachers })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, password, email, phone } = await request.json()
    if (!name || !password) {
      return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 })
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    const teacher = await prisma.teacher.create({
      data: { name, password: hashedPassword, email, phone },
    })
    return NextResponse.json({ success: true, data: teacher })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, password, email, phone } = await request.json()
    const data: any = { name, email, phone }
    if (password) {
      data.password = bcrypt.hashSync(password, 10)
    }
    const teacher = await prisma.teacher.update({ where: { id }, data })
    return NextResponse.json({ success: true, data: teacher })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.teacher.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
