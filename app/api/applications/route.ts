import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const studentId = url.searchParams.get('studentId')
    const teacherId = url.searchParams.get('teacherId')
    
    let applications = []
    
    if (studentId) {
      applications = await prisma.application.findMany({
        where: { studentId },
        include: {
          student: true,
          tasks: { include: { teacher: true } },
        },
      })
    } else if (teacherId) {
      applications = await prisma.application.findMany({
        include: {
          student: true,
          tasks: { include: { teacher: true } },
        },
      })
      applications = applications.filter(app => 
        app.tasks.some(task => task.teacherId === teacherId)
      )
    } else {
      applications = await prisma.application.findMany({
        include: {
          student: true,
          tasks: { include: { teacher: true } },
        },
      })
    }
    
    return NextResponse.json({ success: true, data: applications })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { projectName, ddl, studentId } = await request.json()
    if (!projectName || !ddl || !studentId) {
      return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 })
    }
    
    const application = await prisma.application.create({
      data: { projectName, ddl, studentId },
    })
    
    await prisma.task.createMany({
      data: [
        { type: 'personal', typeName: '个人文书', applicationId: application.id },
        { type: 'recommendation', typeName: '推荐信', applicationId: application.id },
        { type: 'cv', typeName: 'CV简历', applicationId: application.id },
      ],
    })
    
    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, projectName, ddl } = await request.json()
    const application = await prisma.application.update({
      where: { id },
      data: { projectName, ddl },
    })
    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.application.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: '服务器错误' }, { status: 500 })
  }
}
