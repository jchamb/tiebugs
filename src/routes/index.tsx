import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
		}
	};

	return (
		<>
			{/* Hero section */}
			<section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
				<div className="relative max-w-4xl mx-auto">
					{/* Logo / Brand */}
					<div className="mb-8">
						<h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tight">
							<span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
								TieBugs
							</span>
						</h1>
						<p className="text-xl md:text-2xl text-gray-400 font-light">
							Your fly tying recipe collection
						</p>
					</div>

					{/* Search section */}
					<div className="mb-8">
						<h2 className="text-2xl md:text-3xl text-gray-200 mb-6 font-medium">
							What do you want to tie?
						</h2>

						<form
							onSubmit={handleSearch}
							className="flex gap-3 max-w-2xl mx-auto"
						>
							<div className="relative flex-1">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<Input
									type="text"
									placeholder="Search for flies, patterns, materials..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-12 h-14 text-lg bg-slate-800/80 border-slate-600 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/30"
								/>
							</div>
							<Button
								type="submit"
								size="lg"
								className="h-14 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/30"
							>
								Search
							</Button>
						</form>
					</div>

					{/* Recipe count */}
					<div className="text-gray-400">
						<p className="text-lg">
							Search{" "}
							{/* <span className="text-amber-400 font-bold text-2xl">
								{recipeCount.toLocaleString()}
							</span>{" "}
							{recipeCount === 1 ? "fly pattern" : "fly patterns"} */}
						</p>
						<p className="text-sm mt-2 text-gray-500">
							From classic dry flies to modern streamers
						</p>
					</div>

					{/* Quick links */}
					<div className="mt-12 flex flex-wrap justify-center gap-3">
						{[
							"Dry Flies",
							"Nymphs",
							"Streamers",
							"Wet Flies",
							"Emergers",
							"Terrestrials",
						].map((category) => (
							<Button
								key={category}
								variant="outline"
								className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white hover:border-amber-500/50"
								onClick={() => {
									window.location.href = `/search?q=${encodeURIComponent(category)}`;
								}}
							>
								{category}
							</Button>
						))}
					</div>
				</div>

				{/* Decorative elements */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 text-sm">
					<p>Add to the collection by signing in</p>
				</div>
			</section>
		</>
	);
}
