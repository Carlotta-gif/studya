import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({ include: { teacher: true, application: true } })
    return NextResponse.json({ success: true, data: tasks })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, teacherId, fileUrl, fileName, settlement, isSettled, voucherUrl } = await request.json()
    const data: any = {}
    if (teacherId !== undefined) data.teacherId = teacherId
    if (fileUrl !== undefined) data.fileUrl = fileUrl
    if (fileName !== undefined) data.fileName = fileName
    if (settlement !== undefined) data.settlement = settlement
    if (isSettled !== undefined) data.isSettled = isSettled
    if (voucherUrl !== undefined) data.voucherUrl = voucherUrl
    
    const task = await prisma.task.update({ where: { id }, data })
    return NextResponse.json({ success: true, data: task })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
