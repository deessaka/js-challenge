import User from '#models/user'

export class UserDto {
  constructor(private user: User) {}

  toJSON() {
    return {
      id: this.user?.id,
      name: this.user?.username,
      email: this.user?.email,
      avatar: this.user?.avatar,
      unlockedExercises: this.user?.unlockedExercises,
      totalPoints: this.user?.totalPoints,
    }
  }
}
