'use client'

import {signOut} from "next-auth/react";

export const SignOutButton = () => {
	return(
		<button
			onClick={() => signOut()}
			className="p-4  bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
		>
			Sign Out
		</button>
	)
};