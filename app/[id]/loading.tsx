import {WordCardSkeleton} from "@/app/components/WordCardSkeleton";

export default function Loading() {
	return (
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto">
				<WordCardSkeleton/>

				<div className="buttons-container">
					<div className="flex flex-col gap-3 max-w-2xl mx-auto">
						<div className="max-w-[250px] w-full h-12 mx-auto px-4 bg-slate-800 rounded animate-pulse"></div>
						<div
							className="px-3 h-12 py-[11px] rounded-xl w-full transform transition-all duration-200 bg-slate-800 animate-pulse"></div>
					</div>
				</div>
			</div>
		</div>
	);
}