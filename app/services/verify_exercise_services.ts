export default class VerifyExerciseServices {
  #exerciseHandler: any
  #exerciseNotFoundHandler: any

  constructor() {}

  async exec() {}

  onExercise(handler: any) {
    this.#exerciseHandler = handler
    return this
  }

  onExerciseNotFound(handler: any) {
    this.#exerciseNotFoundHandler = handler
    return this
  }

  then(resolve: any, reject?: any): any {
    return this.exec().then(resolve, reject)
  }
  catch(reject: any): any {
    return this.exec().catch(reject)
  }
  finally(fullfilled: any): any {
    return this.exec().finally(fullfilled)
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }
}
