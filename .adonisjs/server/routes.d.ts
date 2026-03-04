import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'landing': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'auth-login.render': { paramsTuple?: []; params?: {} }
    'auth-login.execute': { paramsTuple?: []; params?: {} }
    'auth-logout.execute': { paramsTuple?: []; params?: {} }
    'auth-register.render': { paramsTuple?: []; params?: {} }
    'auth-register.execute': { paramsTuple?: []; params?: {} }
    'auth.verify-email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'auth.resend-verification': { paramsTuple?: []; params?: {} }
    'oauth-callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'oauth-redirect': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'exercise': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'load-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'save-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'execute': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'password.edit': { paramsTuple?: []; params?: {} }
    'password.set': { paramsTuple?: []; params?: {} }
    'password.request-reset.render': { paramsTuple?: []; params?: {} }
    'password.request-reset': { paramsTuple?: []; params?: {} }
    'password.reset': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'password.reset.execute': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  GET: {
    'landing': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'auth-login.render': { paramsTuple?: []; params?: {} }
    'auth-register.render': { paramsTuple?: []; params?: {} }
    'auth.verify-email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'oauth-callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'oauth-redirect': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'exercise': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'load-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'password.edit': { paramsTuple?: []; params?: {} }
    'password.request-reset.render': { paramsTuple?: []; params?: {} }
    'password.reset': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  HEAD: {
    'landing': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'home': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'auth-login.render': { paramsTuple?: []; params?: {} }
    'auth-register.render': { paramsTuple?: []; params?: {} }
    'auth.verify-email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'oauth-callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'oauth-redirect': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'exercise': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'load-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'password.edit': { paramsTuple?: []; params?: {} }
    'password.request-reset.render': { paramsTuple?: []; params?: {} }
    'password.reset': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  POST: {
    'auth-login.execute': { paramsTuple?: []; params?: {} }
    'auth-logout.execute': { paramsTuple?: []; params?: {} }
    'auth-register.execute': { paramsTuple?: []; params?: {} }
    'auth.resend-verification': { paramsTuple?: []; params?: {} }
    'save-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'execute': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'password.set': { paramsTuple?: []; params?: {} }
    'password.request-reset': { paramsTuple?: []; params?: {} }
    'password.reset.execute': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}