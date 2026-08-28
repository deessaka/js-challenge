import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'landing': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'docs.index': { paramsTuple?: []; params?: {} }
    'docs.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'user.tokens.index': { paramsTuple?: []; params?: {} }
    'user.tokens.create': { paramsTuple?: []; params?: {} }
    'user.tokens.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'auth-login.render': { paramsTuple?: []; params?: {} }
    'auth-login.execute': { paramsTuple?: []; params?: {} }
    'auth-logout.execute': { paramsTuple?: []; params?: {} }
    'auth-register.render': { paramsTuple?: []; params?: {} }
    'auth-register.execute': { paramsTuple?: []; params?: {} }
    'auth.verify-email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'auth.resend-verification': { paramsTuple?: []; params?: {} }
    'oauth-callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'oauth-redirect': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'api.v1.me': { paramsTuple?: []; params?: {} }
    'api.v1.challenges': { paramsTuple?: []; params?: {} }
    'api.v1.challenge': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'api.v1.progress': { paramsTuple?: []; params?: {} }
    'api.v1.progress.challenge': { paramsTuple: [ParamValue]; params: {'challengeId': ParamValue} }
    'api.v1.recommendations.next': { paramsTuple?: []; params?: {} }
    'api.v1.submissions.create': { paramsTuple?: []; params?: {} }
    'api.v1.submissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercise': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'load-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'save-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'execute': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.users.role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.reset-progress': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.exercises': { paramsTuple?: []; params?: {} }
    'admin.exercises.create': { paramsTuple?: []; params?: {} }
    'admin.exercises.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.exercises.verify-tests': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.exercises.contracts.validate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.exercises.contracts.publish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
    'docs.index': { paramsTuple?: []; params?: {} }
    'docs.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'user.tokens.index': { paramsTuple?: []; params?: {} }
    'auth-login.render': { paramsTuple?: []; params?: {} }
    'auth-register.render': { paramsTuple?: []; params?: {} }
    'auth.verify-email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'oauth-callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'oauth-redirect': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'api.v1.me': { paramsTuple?: []; params?: {} }
    'api.v1.challenges': { paramsTuple?: []; params?: {} }
    'api.v1.challenge': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'api.v1.progress': { paramsTuple?: []; params?: {} }
    'api.v1.progress.challenge': { paramsTuple: [ParamValue]; params: {'challengeId': ParamValue} }
    'api.v1.recommendations.next': { paramsTuple?: []; params?: {} }
    'api.v1.submissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercise': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'load-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.exercises': { paramsTuple?: []; params?: {} }
    'password.edit': { paramsTuple?: []; params?: {} }
    'password.request-reset.render': { paramsTuple?: []; params?: {} }
    'password.reset': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  HEAD: {
    'landing': { paramsTuple?: []; params?: {} }
    'about': { paramsTuple?: []; params?: {} }
    'docs.index': { paramsTuple?: []; params?: {} }
    'docs.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'user.profile': { paramsTuple?: []; params?: {} }
    'user.tokens.index': { paramsTuple?: []; params?: {} }
    'auth-login.render': { paramsTuple?: []; params?: {} }
    'auth-register.render': { paramsTuple?: []; params?: {} }
    'auth.verify-email': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'oauth-callback': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'oauth-redirect': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'api.v1.me': { paramsTuple?: []; params?: {} }
    'api.v1.challenges': { paramsTuple?: []; params?: {} }
    'api.v1.challenge': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'api.v1.progress': { paramsTuple?: []; params?: {} }
    'api.v1.progress.challenge': { paramsTuple: [ParamValue]; params: {'challengeId': ParamValue} }
    'api.v1.recommendations.next': { paramsTuple?: []; params?: {} }
    'api.v1.submissions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'exercise': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'load-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users': { paramsTuple?: []; params?: {} }
    'admin.exercises': { paramsTuple?: []; params?: {} }
    'password.edit': { paramsTuple?: []; params?: {} }
    'password.request-reset.render': { paramsTuple?: []; params?: {} }
    'password.reset': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  POST: {
    'user.tokens.create': { paramsTuple?: []; params?: {} }
    'auth-login.execute': { paramsTuple?: []; params?: {} }
    'auth-logout.execute': { paramsTuple?: []; params?: {} }
    'auth-register.execute': { paramsTuple?: []; params?: {} }
    'auth.resend-verification': { paramsTuple?: []; params?: {} }
    'api.v1.submissions.create': { paramsTuple?: []; params?: {} }
    'save-progress': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'execute': { paramsTuple: [ParamValue]; params: {'exerciseId': ParamValue} }
    'admin.users.role': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.reset-progress': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.exercises.create': { paramsTuple?: []; params?: {} }
    'admin.exercises.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.exercises.verify-tests': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.exercises.contracts.validate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.exercises.contracts.publish': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'password.set': { paramsTuple?: []; params?: {} }
    'password.request-reset': { paramsTuple?: []; params?: {} }
    'password.reset.execute': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
  }
  DELETE: {
    'user.tokens.revoke': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}