import axios from 'axios'

const baserowClient = axios.create({
	baseURL: 'https://api.baserow.io/api/database',
	headers: {
		Authorization: `Token HTJxVsdSBkZLn6zVrTy32UK0JTXXXQld`
	},
	params: {
		user_field_names: 'true'
	}
})

const tables = {
	users: 1021773,
	workouts: 1021802,
	exercises: 1021808,
	history: 1022192
}

export const baserow = {
	client: baserowClient,
	helpers: {
		async listAllUsers() {
			const { data } =  await baserowClient.get<{ results: User[] }>(`rows/table/${tables.users}/`)

			const users = data.results.map(item => ({
				...item,
				// @ts-ignore
				gender: String(item.gender.value)
			}))

			return users
		},

		async findUserById(id: number): Promise<User | null> {
			try {
				let user: any = {}

				const { data } = await baserowClient.get(`rows/table/${tables.users}/${id}/`)
				user = data
				user.gender = data.gender.value as Gender
				delete user.order

				let { data: { results: workouts } } = await baserowClient.get(`rows/table/${tables.workouts}/`)
				const { data: { results: exercises } } = await baserowClient.get(`rows/table/${tables.exercises}/`)
				
				workouts = workouts.map((w: any) => {
					delete w.order

					w.exercises = exercises.filter((e: any) => e.workouts.some((wk: any) => wk.id === w.id))
						.map((e: any) => ({
							...e,
							focus: e.focus.map((f: any) => f.value)
						}))
					
					return {
						...w,
						user: w.user[0]
					}
				})

				const userWorkouts = workouts.filter((w: Workout) => w.user.id === id)

				user.workouts = userWorkouts

				return user
			} catch(e) {
				return null
			}
		},

		async findUserByUsername(username: string) {
			try {
				let user: any = {}

				const { data } = await baserowClient.get(`rows/table/${tables.users}/`)
				const users = data.results

				user = users.find((u: any) => u.username === username)
				user.gender = user.gender.value as Gender
				delete user.order

				let { data: { results: workouts } } = await baserowClient.get(`rows/table/${tables.workouts}/`)
				const { data: { results: exercises } } = await baserowClient.get(`rows/table/${tables.exercises}/`)
				
				workouts = workouts.map((w: any) => {
					delete w.order

					w.exercises = exercises.filter((e: any) => e.workouts.some((wk: any) => wk.id === w.id))
						.map((e: any) => ({
							...e,
							focus: e.focus.map((f: any) => f.value)
						}))
					
					return {
						...w,
						user: w.user[0]
					}
				})

				const userWorkouts = workouts.filter((w: any) => w.user.value === username)

				user.workouts = userWorkouts

				return user
			} catch(e) {
				return null
			}
		},

		async findExercisesByWorkout(id: number) {
			try {
				const { data: workout } = await baserowClient.get(`rows/table/${tables.workouts}/${id}/`)
				const { data: { results: exercises } } = await baserowClient.get(`rows/table/${tables.exercises}/`)

				delete workout.order
				delete workout.user

				workout.exercises = exercises.map((e: any) => {
					e.focus = e.focus[0].value
					delete e.workout
					delete e.order
					
					return e
				})
				
				return workout
			} catch(e) {
				return null
			}
		},

		async createHistoryItem({ userId, workoutId }: { userId: number, workoutId: number }) {
			try {
				await baserowClient.post(`rows/table/${tables.history}/`, {
					user: userId,
					workout: workoutId
				})
			} catch(e) {
				console.error('Ocorreu um erro.')
			}
		},

		async findHistoryItems(userId: number) {
			try {
				let { data: history } = await baserowClient.get(`rows/table/${tables.history}/?order_by=-date`)
				let { data: workouts } = await baserowClient.get(`rows/table/${tables.workouts}/`)
				workouts = workouts.results

				history = history.results.filter((i: any) => i.user[0].id === userId)
				
				history = history.map((h: any) => {
					const wkt = workouts.find((w: any) => w.id === h.workout[0].id)

					return {
						id: h.id,
						date: h.date,
						workout: {
							id: wkt.id,
							name: wkt.name
						}
					}
				})

				return history
			} catch(e) {
				return null
			}
		}
	}
}