import Exercise from '#models/exercise'

export class ExerciceDto {
  constructor(private exercise: Exercise) {}

  toJSON() {
    return {
      id: this.exercise?.id,
      number: this.exercise?.number,
      title: this.exercise?.title,
      description: this.exercise?.description,
      difficulty: this.exercise?.difficulty,
      is_locked: this.exercise?.is_locked,
    }
  }
}
