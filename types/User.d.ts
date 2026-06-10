type User = {
	id: number
	name: string
	username: string
	gender: Gender
	workouts: Workout[]
}

type Gender = 'M'| 'F'