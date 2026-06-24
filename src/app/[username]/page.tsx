'use client'

import { redirect, useParams } from "next/navigation";

export default function Start() {
	const { username } = useParams()

	redirect(`/${username}/treinos`)
}