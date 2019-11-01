import { Message } from 'element-ui'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        next()
      } else {
        try {
          console.log('a')
          const { roles } = await store.dispatch('user/getInfo')

          console.log({
            to,
            hasToken,
            hasRoles,
            accessRoutes
          })

          const accessRoutes = await store.dispatch(
            'permission/generateRoutes',
            roles
          )

          console.log({
            to,
            hasToken,
            hasRoles,
            accessRoutes
          })

          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
