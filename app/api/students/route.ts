import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    })
    return NextResponse.json({ success: true, data: students })
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
    const student = await prisma.student.create({
      data: { name, password: hashedPassword, email, phone },
    })
    return NextResponse.json({ success: true, data: student })
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
    const student = await prisma.student.update({ where: { id }, data })
    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.student.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
