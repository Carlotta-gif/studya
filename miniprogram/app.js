App({
  globalData: {
    isLoggedIn: false,
    currentRole: '',
    loggedInUser: null,
    managers: [{ password: '920101' }],
    teachers: [],
    students: [],
    applications: []
  },

  onLaunch() {
    this.initData()
  },

  initData() {
    const savedTeachers = wx.getStorageSync('elite_studio_teachers_v3')
    const savedStudents = wx.getStorageSync('elite_studio_students_v3')
    const savedApps = wx.getStorageSync('elite_studio_apps_v3')
    const savedManager = wx.getStorageSync('elite_studio_manager_v1')

    if (savedTeachers) {
      this.globalData.teachers = JSON.parse(savedTeachers)
    } else {
      this.globalData.teachers = [
        { id: 1001, name: '王老师', password: '111111' },
        { id: 1002, name: '李老师', password: '222222' },
        { id: 1003, name: '张老师', password: '333333' }
      ]
      wx.setStorageSync('elite_studio_teachers_v3', JSON.stringify(this.globalData.teachers))
    }

    if (savedStudents) {
      this.globalData.students = JSON.parse(savedStudents)
    } else {
      this.globalData.students = [
        { id: 2001, name: '张伟', password: '888888' },
        { id: 2002, name: '李娜', password: '999999' },
        { id: 2003, name: '陈静', password: '777777' }
      ]
      wx.setStorageSync('elite_studio_students_v3', JSON.stringify(this.globalData.students))
    }

    if (savedApps) {
      this.globalData.applications = JSON.parse(savedApps)
    } else {
      this.globalData.applications = [
        {
          id: 1,
          studentName: '张伟',
          projectName: '香港大学 - 金融学硕士 (MSc Finance)',
          ddl: '2026-05-22',
          tasks: [
            { id: 101, type: 'PS', typeName: '个人陈述文书', teacher: '王老师', fileUrl: 'mock_ps.pdf', fileName: 'Zhang_Wei_HKU_PS_v2.pdf', settlement: 1200, isSettled: true, voucherUrl: '', voucherName: '' },
            { id: 102, type: 'RL', typeName: '推荐信', teacher: '李老师', fileUrl: '', fileName: '', settlement: 500, isSettled: false, voucherUrl: '', voucherName: '' },
            { id: 103, type: 'CV', typeName: '简历CV', teacher: '王老师', fileUrl: 'mock_cv.pdf', fileName: 'Zhang_Wei_HKU_CV_v1.pdf', settlement: 400, isSettled: false, voucherUrl: '', voucherName: '' }
          ]
        },
        {
          id: 2,
          studentName: '李娜',
          projectName: '新加坡国立大学 - 计算机硕士 (MSc CS)',
          ddl: '2026-06-15',
          tasks: [
            { id: 104, type: 'PS', typeName: '个人陈述文书', teacher: '张老师', fileUrl: 'mock_ps.pdf', fileName: 'Li_Na_NUS_PS_Draft.pdf', settlement: 1500, isSettled: false, voucherUrl: '', voucherName: '' },
            { id: 105, type: 'RL', typeName: '推荐信', teacher: '王老师', fileUrl: '', fileName: '', settlement: 600, isSettled: false, voucherUrl: '', voucherName: '' },
            { id: 106, type: 'CV', typeName: '简历CV', teacher: '张老师', fileUrl: 'mock_cv.pdf', fileName: 'Li_Na_NUS_CV_Final.pdf', settlement: 400, isSettled: false, voucherUrl: '', voucherName: '' }
          ]
        },
        {
          id: 3,
          studentName: '陈静',
          projectName: '南洋理工大学 - 商业分析硕士 (MSc BA)',
          ddl: '2026-05-20',
          tasks: [
            { id: 107, type: 'PS', typeName: '个人陈述文书', teacher: '王老师', fileUrl: '', fileName: '', settlement: 1200, isSettled: false, voucherUrl: '', voucherName: '' },
            { id: 108, type: 'RL', typeName: '推荐信', teacher: '李老师', fileUrl: 'mock_rl.pdf', fileName: 'Chen_Jing_NTU_RL_Draft.pdf', settlement: 500, isSettled: false, voucherUrl: '', voucherName: '' },
            { id: 109, type: 'CV', typeName: '简历CV', teacher: '王老师', fileUrl: '', fileName: '', settlement: 400, isSettled: false, voucherUrl: '', voucherName: '' }
          ]
        }
      ]
      wx.setStorageSync('elite_studio_apps_v3', JSON.stringify(this.globalData.applications))
    }

    if (savedManager) {
      try {
        this.globalData.managers = [JSON.parse(savedManager)]
      } catch (e) {}
    } else {
      wx.setStorageSync('elite_studio_manager_v1', JSON.stringify({ password: '920101' }))
    }
  },

  saveTeachers() {
    wx.setStorageSync('elite_studio_teachers_v3', JSON.stringify(this.globalData.teachers))
  },

  saveStudents() {
    wx.setStorageSync('elite_studio_students_v3', JSON.stringify(this.globalData.students))
  },

  saveApplications() {
    wx.setStorageSync('elite_studio_apps_v3', JSON.stringify(this.globalData.applications))
  },

  saveManager() {
    wx.setStorageSync('elite_studio_manager_v1', JSON.stringify(this.globalData.managers[0]))
  }
})