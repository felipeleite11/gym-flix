'use client'

import Particles from "@tsparticles/react"

// https://particles.js.org/playground/shapes

export function CircleParticles({ id } : { id: string }) {
	return (
		<Particles
			id={id}
			className="absolute size-full"
			options={{
				fullScreen: {
					enable: false
				},
				// background: {
				// 	color: {
				// 		value: '#0b1120'
				// 	}
				// },
				particles: {
					move: {
						enable: true,
						speed: 0.6
					},
					number: {
						value: 20
					},
					opacity: {
						value: {
							min: 0.25,
							max: 0.65
						}
					},
					paint: {
						fill: {
							color: {
								value: ['#ccff00']
							}
						}
					},
					shape: {
						type: 'circle'
					},
					size: {
						value: {
							min: 1,
							max: 4
						}
					}
				}
			}}
		/>
	)
}