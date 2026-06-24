import { createStore, StoreApi } from "zustand/vanilla"
import { useStore as useZustandStore } from "zustand"
import { persist } from 'zustand/middleware'

type WorkoutStore = {
	workout: Workout | null
	exercises: Exercise[]
	setWorkout: (workout: Workout) => void
	addExercise: (exercise: Exercise) => void
	clearWorkout: () => void
}

let store: StoreApi<WorkoutStore> | undefined

const initStore = () => createStore<WorkoutStore>()(
	persist(
		set => ({
			workout: null,
			exercises: [],

			setWorkout: (workout: Workout) => set(() => ({
				workout
			})),
			
			addExercise: (exercise: Exercise) => set((state) => ({
				exercises: [...state.exercises, exercise]
			})),

			clearWorkout: () => set({
				workout: null,
				exercises: []
			})
		}),
		{ name: 'gym-flix/workout' }
	)
)

export const useWorkout = <T>(selector: (state: WorkoutStore) => T): T => {
	if (!store) {
		store = initStore()
	}

	return useZustandStore(store, selector)
}
