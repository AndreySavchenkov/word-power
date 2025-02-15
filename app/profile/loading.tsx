export default function Loading() {
	return (
		<div className={"my-auto max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"}>

			<div className="flex flex-col pt-24 gap-4  p-2">

				<div className="w-1/2 h-8 bg-slate-800 rounded animate-pulse"></div>

				<div className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 animate-pulse">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-slate-700 animate-pulse"></div>
						<div className="w-16 h-8 rounded-lg bg-slate-700 animate-pulse"></div>
					</div>

					<div className="w-full flex pt-4 justify-between">
						<div className="w-20 h-6 rounded-lg bg-slate-700 animate-pulse"></div>
						<div className="w-8 h-6 rounded-lg bg-slate-700 animate-pulse"></div>
					</div>

					<div className="w-full flex pt-2 justify-between">
						<div className="w-28 h-6 rounded-lg bg-slate-700 animate-pulse"></div>
						<div className="w-8 h-6 rounded-lg bg-slate-700 animate-pulse"></div>
					</div>
				</div>

				<div className="bg-slate-800 h-14 rounded-lg p-4 hover:bg-slate-700 animate-pulse"></div>

			</div>
		</div>
	);
}