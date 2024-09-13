import Exercise from '#models/exercise'

export class ExerciseDto {
  constructor(private exercise: Exercise) {}

  toJSON() {
    return {
      id: this.exercise?.id,
      number: this.exercise?.number,
      title: this.exercise?.title,
      description: this.exercise?.description,
      difficulty: this.exercise?.difficulty,
    }
  }
}
