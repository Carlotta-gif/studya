const app = getApp()

Page({
  data: {
    currentRole: '',
    loggedInUser: null,
    roleName: '',
    uniqueStudentsCount: 0,
    urgentProjectsCount: 0,
    deliveryProgress: '',
    totalSettlement: 0,
    paidSettlement: 0,
    teacherSettlementSummaries: [],
    filters: {
      studentName: '',
      projectName: '',
      ddlMax: '',
      daysLeftMax: '',
      teacherName: ''
    },
    filteredList: [],
    students: [],
    teachers: [],
    applications: [],
    isModalOpen: false,
    modalType: '',
    modalTitle: '',
    isEditing: false,
    editingId: null,
    formData: {
      name: '',
      password: '',
      studentId: '',
      projectName: '',
      ddl: '',
      studentIndex: 0,
      current: '',
      new: '',
      confirm: ''
    }
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    this.initData()
  },

  initData() {
    const applications = app.globalData.applications
    const roleName = this._getRoleName(app.globalData.currentRole, app.globalData.loggedInUser)
    const uniqueStudentsCount = this._getUniqueStudentsCount(applications)
    const urgentProjectsCount = this._getUrgentProjectsCount(applications)
    const deliveryProgress = this._getDeliveryProgress(applications)
    const totalSettlement = this._getTotalSettlement(applications)
    const paidSettlement = this._getPaidSettlement(applications)
    const teacherSettlementSummaries = this._getTeacherSettlementSummaries(applications)

    this.setData({
      currentRole: app.globalData.currentRole,
      loggedInUser: app.globalData.loggedInUser,
      roleName: roleName,
      uniqueStudentsCount: uniqueStudentsCount,
      urgentProjectsCount: urgentProjectsCount,
      deliveryProgress: deliveryProgress,
      totalSettlement: totalSettlement,
      paidSettlement: paidSettlement,
      teacherSettlementSummaries: teacherSettlementSummaries,
      students: app.globalData.students,
      teachers: app.globalData.teachers,
      applications: applications,
      filteredList: this._filterApplications(applications),
      isModalOpen: false,
      modalType: '',
      modalTitle: '',
      isEditing: false,
      editingId: null,
      teacherNames: this.getTeacherNames()
    })
    this.resetFilters()
  },

  _getRoleName(role, user) {
    if (role === 'manager') return '👔 工作室管理人'
    if (role === 'teacher') return `👨‍🏫 ${user.name}`
    if (role === 'student') return `🎓 ${user.name}`
    return ''
  },

  _getUniqueStudentsCount(applications) {
    return new Set(applications.map(a => a.studentName)).size
  },

  _getUrgentProjectsCount(applications) {
    return applications.filter(a => this.isUrgent(a.ddl)).length
  },

  _getDeliveryProgress(applications) {
    let total = 0
    let delivered = 0
    applications.forEach(a => {
      a.tasks.forEach(t => {
        total++
        if (t.fileUrl) delivered++
      })
    })
    return total > 0 ? `${delivered}/${total}` : '0/0'
  },

  _getTotalSettlement(applications) {
    let total = 0
    applications.forEach(a => {
      a.tasks.forEach(t => {
        if (!t.isSettled) total += t.settlement || 0
      })
    })
    return total
  },

  _getPaidSettlement(applications) {
    let total = 0
    applications.forEach(a => {
      a.tasks.forEach(t => {
        if (t.isSettled) total += t.settlement || 0
      })
    })
    return total
  },

  _getTeacherSettlementSummaries(applications) {
    const teacherMap = {}
    applications.forEach(app => {
      app.tasks.forEach(task => {
        if (task.teacher) {
          if (!teacherMap[task.teacher]) {
            teacherMap[task.teacher] = {
              teacher: task.teacher,
              count: 0,
              total: 0,
              settledTotal: 0
            }
          }
          teacherMap[task.teacher].count++
          teacherMap[task.teacher].total += task.settlement || 0
          if (task.isSettled) {
            teacherMap[task.teacher].settledTotal += task.settlement || 0
          }
        }
      })
    })
    return Object.values(teacherMap)
  },

  resetFilters() {
    const filters = {
      studentName: this.data.currentRole === 'student' ? this.data.loggedInUser.name : '',
      projectName: '',
      ddlMax: '',
      daysLeftMax: '',
      teacherName: ''
    }
    this.setData({ filters })
  },

  getRoleName() {
    if (this.data.currentRole === 'manager') return '👔 工作室管理人'
    if (this.data.currentRole === 'teacher') return `👨‍🏫 ${this.data.loggedInUser.name}`
    if (this.data.currentRole === 'student') return `🎓 ${this.data.loggedInUser.name}`
    return ''
  },

  getDaysLeft(ddlStr) {
    const today = new Date()
    const ddl = new Date(ddlStr)
    return Math.ceil((ddl - today) / (1000 * 60 * 60 * 24))
  },

  isUrgent(ddlStr) {
    const days = this.getDaysLeft(ddlStr)
    return days <= 7 && days >= 0
  },

  getTaskTypeClass(type) {
    return type
  },

  getUniqueStudentsCount() {
    return new Set(this.data.applications.map(a => a.studentName)).size
  },

  getUrgentProjectsCount() {
    return this.data.applications.filter(a => this.isUrgent(a.ddl)).length
  },

  getDeliveryProgress() {
    let total = 0
    let delivered = 0
    this.data.applications.forEach(a => {
      a.tasks.forEach(t => {
        total++
        if (t.fileUrl) delivered++
      })
    })
    return total > 0 ? Math.round((delivered / total) * 100) + '%' : '0%'
  },

  getTotalSettlement() {
    let total = 0
    this.data.applications.forEach(a => {
      a.tasks.forEach(t => {
        if (!t.isSettled) total += t.settlement || 0
      })
    })
    return total
  },

  getPaidSettlement() {
    let total = 0
    this.data.applications.forEach(a => {
      a.tasks.forEach(t => {
        if (t.isSettled) total += t.settlement || 0
      })
    })
    return total
  },

  getTeacherSettlementSummaries() {
    const teacherMap = {}
    
    this.data.applications.forEach(app => {
      app.tasks.forEach(task => {
        if (task.teacher) {
          if (!teacherMap[task.teacher]) {
            teacherMap[task.teacher] = {
              teacher: task.teacher,
              count: 0,
              total: 0,
              settledTotal: 0
            }
          }
          teacherMap[task.teacher].count++
          teacherMap[task.teacher].total += task.settlement || 0
          if (task.isSettled) {
            teacherMap[task.teacher].settledTotal += task.settlement || 0
          }
        }
      })
    })

    return Object.values(teacherMap)
  },

  _filterApplications(applications) {
    let list = [...applications]
    const { studentName, projectName, ddlMax, daysLeftMax, teacherName } = this.data.filters

    if (this.data.currentRole === 'student') {
      list = list.filter(a => a.studentName === this.data.loggedInUser.name)
    } else if (this.data.currentRole === 'teacher') {
      list = list.filter(a => a.tasks.some(t => t.teacher === this.data.loggedInUser.name))
    }

    if (studentName) {
      const kw = studentName.toLowerCase()
      list = list.filter(a => a.studentName.toLowerCase().includes(kw))
    }
    if (projectName) {
      const kw = projectName.toLowerCase()
      list = list.filter(a => a.projectName.toLowerCase().includes(kw))
    }
    if (ddlMax) {
      list = list.filter(a => new Date(a.ddl) <= new Date(ddlMax))
    }
    if (daysLeftMax) {
      list = list.filter(a => this.getDaysLeft(a.ddl) <= Number(daysLeftMax))
    }
    if (teacherName) {
      const kw = teacherName.toLowerCase()
      list = list.filter(a => a.tasks.some(t => t.teacher && t.teacher.toLowerCase().includes(kw)))
    }

    return list.map(a => ({
      ...a,
      urgent: this.isUrgent(a.ddl),
      days: this.getDaysLeft(a.ddl)
    })).sort((a, b) => (a.urgent ? 0 : 1) - (b.urgent ? 0 : 1) || a.days - b.days)
  },

  filteredApplications() {
    let list = [...this.data.applications]

    if (this.data.currentRole === 'student') {
      list = list.filter(a => a.studentName === this.data.loggedInUser.name)
    } else if (this.data.currentRole === 'teacher') {
      list = list.filter(a => a.tasks.some(t => t.teacher === this.data.loggedInUser.name))
    }

    const { studentName, projectName, ddlMax, daysLeftMax, teacherName } = this.data.filters

    if (studentName) {
      const kw = studentName.toLowerCase()
      list = list.filter(a => a.studentName.toLowerCase().includes(kw))
    }
    if (projectName) {
      const kw = projectName.toLowerCase()
      list = list.filter(a => a.projectName.toLowerCase().includes(kw))
    }
    if (ddlMax) {
      list = list.filter(a => new Date(a.ddl) <= new Date(ddlMax))
    }
    if (daysLeftMax) {
      list = list.filter(a => this.getDaysLeft(a.ddl) <= Number(daysLeftMax))
    }
    if (teacherName) {
      const kw = teacherName.toLowerCase()
      list = list.filter(a => a.tasks.some(t => t.teacher && t.teacher.toLowerCase().includes(kw)))
    }

    return list.map(a => ({
      ...a,
      urgent: this.isUrgent(a.ddl) ? 1 : 2,
      days: this.getDaysLeft(a.ddl)
    })).sort((a, b) => a.urgent - b.urgent || a.days - b.days)
  },

  onStudentNameInput(e) {
    this.setData({ 
      'filters.studentName': e.detail.value,
      filteredList: this._filterApplications(this.data.applications)
    })
  },

  onProjectNameInput(e) {
    this.setData({ 
      'filters.projectName': e.detail.value,
      filteredList: this._filterApplications(this.data.applications)
    })
  },

  onDdlMaxChange(e) {
    this.setData({ 
      'filters.ddlMax': e.detail.value,
      filteredList: this._filterApplications(this.data.applications)
    })
  },

  onDaysLeftMaxChange(e) {
    this.setData({ 
      'filters.daysLeftMax': e.detail.value,
      filteredList: this._filterApplications(this.data.applications)
    })
  },

  onTeacherNameInput(e) {
    this.setData({ 
      'filters.teacherName': e.detail.value,
      filteredList: this._filterApplications(this.data.applications)
    })
  },

  updateTeacher(e) {
    const appId = e.currentTarget.dataset.appId
    const taskId = e.currentTarget.dataset.taskId
    const teacherIndex = e.detail.value
    const teacherName = this.data.teacherNames[teacherIndex]

    let applications = this.data.applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          tasks: app.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, teacher: teacherName }
            }
            return task
          })
        }
      }
      return app
    })

    this.setData({ 
      applications,
      filteredList: this._filterApplications(applications),
      totalSettlement: this._getTotalSettlement(applications),
      paidSettlement: this._getPaidSettlement(applications),
      teacherSettlementSummaries: this._getTeacherSettlementSummaries(applications)
    })
    app.globalData.applications = applications
    app.saveApplications()
  },

  updateSettlement(e) {
    const appId = e.currentTarget.dataset.appId
    const taskId = e.currentTarget.dataset.taskId
    const settlement = Number(e.detail.value)

    let applications = this.data.applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          tasks: app.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, settlement: settlement || 0 }
            }
            return task
          })
        }
      }
      return app
    })

    this.setData({ 
      applications,
      filteredList: this._filterApplications(applications),
      totalSettlement: this._getTotalSettlement(applications),
      paidSettlement: this._getPaidSettlement(applications),
      teacherSettlementSummaries: this._getTeacherSettlementSummaries(applications)
    })
    app.globalData.applications = applications
    app.saveApplications()
  },

  toggleSettlement(e) {
    const appId = e.currentTarget.dataset.appId
    const taskId = e.currentTarget.dataset.taskId
    const isSettled = e.detail.value === '已结算'

    let applications = this.data.applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          tasks: app.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, isSettled: isSettled }
            }
            return task
          })
        }
      }
      return app
    })

    this.setData({ 
      applications,
      filteredList: this._filterApplications(applications),
      totalSettlement: this._getTotalSettlement(applications),
      paidSettlement: this._getPaidSettlement(applications),
      teacherSettlementSummaries: this._getTeacherSettlementSummaries(applications)
    })
    app.globalData.applications = applications
    app.saveApplications()
  },

  openStudentModal() {
    this.setData({
      isModalOpen: true,
      modalType: 'student',
      modalTitle: '管理学生档案',
      isEditing: false,
      editingId: null,
      formData: {
        name: '',
        password: this.generate6DigitPassword()
      }
    })
  },

  openTeacherModal() {
    this.setData({
      isModalOpen: true,
      modalType: 'teacher',
      modalTitle: '管理合作老师',
      isEditing: false,
      editingId: null,
      formData: {
        name: '',
        password: this.generate6DigitPassword()
      }
    })
  },

  openProjectModal() {
    const studentNames = this.data.students.map(s => s.name)
    this.setData({
      isModalOpen: true,
      modalType: 'project',
      modalTitle: '新建申请项目',
      isEditing: false,
      editingId: null,
      formData: {
        studentId: '',
        projectName: '',
        ddl: '',
        studentIndex: 0
      },
      studentNames
    })
  },

  openProjectEditModal(e) {
    const id = e.currentTarget.dataset.id
    const appItem = this.data.applications.find(a => a.id === id)
    const studentNames = this.data.students.map(s => s.name)
    const studentIndex = this.data.students.findIndex(s => s.name === appItem.studentName)

    this.setData({
      isModalOpen: true,
      modalType: 'project',
      modalTitle: '修改项目信息',
      isEditing: true,
      editingId: id,
      formData: {
        studentId: appItem.studentName,
        projectName: appItem.projectName,
        ddl: appItem.ddl,
        studentIndex: studentIndex >= 0 ? studentIndex : 0
      },
      studentNames
    })
  },

  openManagerPwdModal() {
    this.setData({
      isModalOpen: true,
      modalType: 'managerPwd',
      modalTitle: '修改管理人密码',
      isEditing: false,
      editingId: null,
      formData: {
        current: '',
        new: '',
        confirm: ''
      }
    })
  },

  closeModal() {
    this.setData({ isModalOpen: false })
  },

  stopPropagation() {},

  generate6DigitPassword() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  },

  generatePassword() {
    this.setData({ 'formData.password': this.generate6DigitPassword() })
  },

  onFormNameInput(e) {
    this.setData({ 'formData.name': e.detail.value })
  },

  onFormPasswordInput(e) {
    this.setData({ 'formData.password': e.detail.value })
  },

  onProjectNameInputModal(e) {
    this.setData({ 'formData.projectName': e.detail.value })
  },

  onStudentChange(e) {
    const index = e.detail.value
    const student = this.data.students[index]
    this.setData({
      'formData.studentIndex': index,
      'formData.studentId': student ? student.id : ''
    })
  },

  onDdlChange(e) {
    this.setData({ 'formData.ddl': e.detail.value })
  },

  onCurrentPwdInput(e) {
    this.setData({ 'formData.current': e.detail.value })
  },

  onNewPwdInput(e) {
    this.setData({ 'formData.new': e.detail.value })
  },

  onConfirmPwdInput(e) {
    this.setData({ 'formData.confirm': e.detail.value })
  },

  editStudent(e) {
    const id = e.currentTarget.dataset.id
    const student = this.data.students.find(s => s.id === id)
    this.setData({
      isEditing: true,
      editingId: id,
      formData: {
        name: student.name,
        password: student.password
      }
    })
  },

  editTeacher(e) {
    const id = e.currentTarget.dataset.id
    const teacher = this.data.teachers.find(t => t.id === id)
    this.setData({
      isEditing: true,
      editingId: id,
      formData: {
        name: teacher.name,
        password: teacher.password
      }
    })
  },

  removeStudent(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '将删除该学生所有数据',
      success: (res) => {
        if (res.confirm) {
          const student = this.data.students.find(s => s.id === id)
          let students = this.data.students.filter(s => s.id !== id)
          let applications = this.data.applications.filter(a => a.studentName !== student.name)

          this.setData({ students, applications })
          app.globalData.students = students
          app.globalData.applications = applications
          app.saveStudents()
          app.saveApplications()

          wx.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  },

  removeTeacher(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '该老师任务将变为未分配',
      success: (res) => {
        if (res.confirm) {
          const teacher = this.data.teachers.find(t => t.id === id)
          let teachers = this.data.teachers.filter(t => t.id !== id)
          let applications = this.data.applications.map(a => ({
            ...a,
            tasks: a.tasks.map(t => ({
              ...t,
              teacher: t.teacher === teacher.name ? '' : t.teacher
            }))
          }))

          this.setData({ teachers, applications })
          app.globalData.teachers = teachers
          app.globalData.applications = applications
          app.saveTeachers()
          app.saveApplications()

          wx.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  },

  deleteProject(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '所有任务和文档将丢失',
      success: (res) => {
        if (res.confirm) {
          let applications = this.data.applications.filter(a => a.id !== id)
          this.setData({ applications })
          app.globalData.applications = applications
          app.saveApplications()
          wx.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  },

  saveForm() {
    const { modalType, formData, isEditing, editingId } = this.data

    if (modalType === 'student') {
      if (!formData.name || formData.password.length !== 6) {
        wx.showToast({ title: '请填写完整信息', icon: 'error' })
        return
      }

      if (isEditing) {
        const oldStudent = this.data.students.find(s => s.id === editingId)
        let students = this.data.students.map(s =>
          s.id === editingId ? { ...s, name: formData.name, password: formData.password } : s
        )
        let applications = this.data.applications.map(a => ({
          ...a,
          studentName: a.studentName === oldStudent.name ? formData.name : a.studentName
        }))

        this.setData({ students, applications })
        app.globalData.students = students
        app.globalData.applications = applications
        app.saveStudents()
        app.saveApplications()

        wx.showToast({ title: '更新成功', icon: 'success' })
      } else {
        if (this.data.students.some(s => s.name === formData.name)) {
          wx.showToast({ title: '学生已存在', icon: 'error' })
          return
        }

        const id = Date.now()
        let students = [...this.data.students, { id, name: formData.name, password: formData.password }]
        this.setData({ 
          students,
          filteredList: this._filterApplications(this.data.applications)
        })
        app.globalData.students = students
        app.saveStudents()

        wx.showToast({ title: '添加成功', icon: 'success' })
      }
    } else if (modalType === 'teacher') {
      if (!formData.name || formData.password.length !== 6) {
        wx.showToast({ title: '请填写完整信息', icon: 'error' })
        return
      }

      if (isEditing) {
        const oldTeacher = this.data.teachers.find(t => t.id === editingId)
        let teachers = this.data.teachers.map(t =>
          t.id === editingId ? { ...t, name: formData.name, password: formData.password } : t
        )
        let applications = this.data.applications.map(a => ({
          ...a,
          tasks: a.tasks.map(t => ({
            ...t,
            teacher: t.teacher === oldTeacher.name ? formData.name : t.teacher
          }))
        }))

        this.setData({ teachers, applications })
        app.globalData.teachers = teachers
        app.globalData.applications = applications
        app.saveTeachers()
        app.saveApplications()

        wx.showToast({ title: '更新成功', icon: 'success' })
      } else {
        if (this.data.teachers.some(t => t.name === formData.name)) {
          wx.showToast({ title: '老师已存在', icon: 'error' })
          return
        }

        let teachers = [...this.data.teachers, { id: Date.now(), name: formData.name, password: formData.password }]
        this.setData({ teachers })
        app.globalData.teachers = teachers
        app.saveTeachers()

        wx.showToast({ title: '添加成功', icon: 'success' })
      }
    } else if (modalType === 'project') {
      if (!formData.projectName || !formData.ddl) {
        wx.showToast({ title: '请填写完整信息', icon: 'error' })
        return
      }

      const student = this.data.students[formData.studentIndex]
      if (!student) {
        wx.showToast({ title: '请选择学生', icon: 'error' })
        return
      }

      if (isEditing) {
        let applications = this.data.applications.map(a =>
          a.id === editingId ? {
            ...a,
            studentName: student.name,
            projectName: formData.projectName,
            ddl: formData.ddl
          } : a
        )
        this.setData({ 
          applications,
          filteredList: this._filterApplications(applications)
        })
        app.globalData.applications = applications
        app.saveApplications()
        wx.showToast({ title: '更新成功', icon: 'success' })
      } else {
        const id = Date.now()
        let applications = [...this.data.applications, {
          id,
          studentName: student.name,
          projectName: formData.projectName,
          ddl: formData.ddl,
          tasks: [
            { id: id + 1, type: 'PS', typeName: '个人陈述文书', teacher: '', fileUrl: '', fileName: '', settlement: 0, isSettled: false, voucherUrl: '' },
            { id: id + 2, type: 'RL', typeName: '推荐信', teacher: '', fileUrl: '', fileName: '', settlement: 0, isSettled: false, voucherUrl: '' },
            { id: id + 3, type: 'CV', typeName: '简历CV', teacher: '', fileUrl: '', fileName: '', settlement: 0, isSettled: false, voucherUrl: '' }
          ]
        }]

        this.setData({ 
          applications,
          filteredList: this._filterApplications(applications)
        })
        app.globalData.applications = applications
        app.saveApplications()
        wx.showToast({ title: '创建成功', icon: 'success' })
      }
    } else if (modalType === 'managerPwd') {
      const { current, new: newPwd, confirm } = formData
      const stored = app.globalData.managers[0]?.password || '920101'

      if (current !== stored) {
        wx.showToast({ title: '当前密码不正确', icon: 'error' })
        return
      }
      if (!newPwd || newPwd.length < 4) {
        wx.showToast({ title: '新密码至少4位', icon: 'error' })
        return
      }
      if (newPwd !== confirm) {
        wx.showToast({ title: '两次密码不一致', icon: 'error' })
        return
      }

      app.globalData.managers[0].password = newPwd
      app.saveManager()
      wx.showToast({ title: '密码已更新', icon: 'success' })
    }

    this.closeModal()
  },

  uploadFile(e) {
    const appId = e.currentTarget.dataset.appId
    const taskId = e.currentTarget.dataset.taskId

    wx.chooseMessageFile({
      count:1,
      type: 'file',
      extension: ['pdf'],
      success: (res) => {
        const file = res.tempFiles[0]
        const fileName = file.name

        wx.showLoading({ title: '上传中...' })

        setTimeout(() => {
          let applications = this.data.applications.map(app => {
            if (app.id === appId) {
              return {
                ...app,
                tasks: app.tasks.map(task => {
                  if (task.id === taskId) {
                    return { 
                      ...task, 
                      fileUrl: file.path, 
                      fileName: fileName 
                    }
                  }
                  return task
                })
              }
            }
            return app
          })

          this.setData({ applications })
          app.globalData.applications = applications
          app.saveApplications()

          wx.hideLoading()
          wx.showToast({ title: '上传成功', icon: 'success' })
        }, 1000)
      },
      fail: (err) => {
        wx.showToast({ title: '上传失败', icon: 'error' })
      }
    })
  },

  previewFile(e) {
    const url = e.currentTarget.dataset.url
    const name = e.currentTarget.dataset.name

    wx.showLoading({ title: '加载中...' })

    wx.downloadFile({
      url: url,
      success: (res) => {
        wx.hideLoading()
        wx.openDocument({
          filePath: res.tempFilePath,
          fileType: 'pdf',
          showMenu: true,
          success: () => {},
          fail: (err) => {
            wx.showToast({ title: '预览失败', icon: 'error' })
          }
        })
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({ title: '下载失败', icon: 'error' })
      }
    })
  },

  uploadVoucher(e) {
    const appId = e.currentTarget.dataset.appId
    const taskId = e.currentTarget.dataset.taskId

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]

        wx.showLoading({ title: '上传中...' })

        setTimeout(() => {
          let applications = this.data.applications.map(app => {
            if (app.id === appId) {
              return {
                ...app,
                tasks: app.tasks.map(task => {
                  if (task.id === taskId) {
                    return { 
                      ...task, 
                      voucherUrl: tempFilePath 
                    }
                  }
                  return task
                })
              }
            }
            return app
          })

          this.setData({ applications })
          app.globalData.applications = applications
          app.saveApplications()

          wx.hideLoading()
          wx.showToast({ title: '上传成功', icon: 'success' })
        }, 1000)
      },
      fail: (err) => {
        wx.showToast({ title: '上传失败', icon: 'error' })
      }
    })
  },

  previewVoucher(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url],
      current: url
    })
  },

  clearVoucher(e) {
    const appId = e.currentTarget.dataset.appId
    const taskId = e.currentTarget.dataset.taskId

    wx.showModal({
      title: '确认清除',
      content: '确定要清除付款凭证吗？',
      success: (res) => {
        if (res.confirm) {
          let applications = this.data.applications.map(app => {
            if (app.id === appId) {
              return {
                ...app,
                tasks: app.tasks.map(task => {
                  if (task.id === taskId) {
                    return { 
                      ...task, 
                      voucherUrl: '' 
                    }
                  }
                  return task
                })
              }
            }
            return app
          })

          this.setData({ applications })
          app.globalData.applications = applications
          app.saveApplications()

          wx.showToast({ title: '已清除', icon: 'success' })
        }
      }
    })
  },

  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.isLoggedIn = false
          app.globalData.currentRole = ''
          app.globalData.loggedInUser = null

          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
})