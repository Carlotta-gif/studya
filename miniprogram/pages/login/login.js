const app = getApp()

Page({
  data: {
    loginForm: {
      role: 'manager',
      username: '',
      password: ''
    },
    showTestInfo: false
  },

  switchRole(e) {
    const role = e.currentTarget.dataset.role
    this.setData({
      'loginForm.role': role,
      'loginForm.username': '',
      'loginForm.password': ''
    })
  },

  onUsernameInput(e) {
    this.setData({
      'loginForm.username': e.detail.value
    })
  },

  onPasswordInput(e) {
    this.setData({
      'loginForm.password': e.detail.value
    })
  },

  toggleTestInfo() {
    this.setData({
      showTestInfo: !this.data.showTestInfo
    })
  },

  getRoleButtonColor() {
    const role = this.data.loginForm.role
    if (role === 'manager') return 'manager-btn'
    if (role === 'teacher') return 'teacher-btn'
    if (role === 'student') return 'student-btn'
    return ''
  },

  handleLogin() {
    const { role, username, password } = this.data.loginForm
    const pass = password.trim()
    const name = username.trim()

    if (role === 'manager') {
      const manager = app.globalData.managers[0]
      if (pass === (manager && manager.password ? manager.password : '920101')) {
        this.loginSuccess('manager', { name: '工作室管理人' })
      } else {
        wx.showToast({
          title: '管理人密码错误！',
          icon: 'error'
        })
      }
    } else if (role === 'teacher') {
      const teacher = app.globalData.teachers.find(t => t.name.trim() === name && t.password.trim() === pass)
      if (teacher) {
        this.loginSuccess('teacher', teacher)
      } else {
        wx.showToast({
          title: '老师信息不匹配！',
          icon: 'error'
        })
      }
    } else if (role === 'student') {
      const student = app.globalData.students.find(s => s.name.trim() === name && s.password.trim() === pass)
      if (student) {
        this.loginSuccess('student', student)
      } else {
        wx.showToast({
          title: '学生信息不匹配！',
          icon: 'error'
        })
      }
    }
  },

  loginSuccess(role, user) {
    app.globalData.isLoggedIn = true
    app.globalData.currentRole = role
    app.globalData.loggedInUser = user

    wx.showToast({
      title: role === 'manager' ? '登录成功！' : `${user.name}欢迎登录！`,
      icon: 'success'
    })

    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }, 1500)
  }
})