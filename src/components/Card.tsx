'use client'

import { ReactNode, useEffect, useRef } from "react"

export function Card({ children }: { children: ReactNode }) {
	const cardRef = useRef<HTMLDivElement>(null)
	const lightRef = useRef<HTMLDivElement>(null)
	
	useEffect(() => {
		function onMouseMove(e: MouseEvent) {
			const x = e.clientX
			const y = e.clientY

			if(lightRef.current && cardRef.current) {
				const { left: cardWidth, top: cardHeight } = cardRef.current.getBoundingClientRect()
				const { width: lightWidth, height: lightHeight } = lightRef.current.getBoundingClientRect()

				const XCoord = x - cardWidth - lightWidth / 2
				const YCoord = y - cardHeight - lightHeight / 2
				
				lightRef.current.style.transform = `translate(${XCoord}px, ${YCoord}px)`
				lightRef.current.style.opacity = '0.6'
			}
		}

		window.addEventListener('mousemove', onMouseMove)

		return () => {
			window.removeEventListener('mousemove', onMouseMove)
		}
	}, [])

	return (
		<div className="relative overflow-hidden z-10 backdrop-blur-3xl" ref={cardRef}>
			{children}

			<div ref={lightRef} className='light opacity-0 size-100 rounded-full absolute top-0 left-0 z-0 bg-[radial-gradient(50%_50%_at_50%_50%,#ffffff11_0%,rgba(104,134,255,0)_100%)]' />
		</div>
	)
}