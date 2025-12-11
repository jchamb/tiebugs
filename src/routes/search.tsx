import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const validateSearch = z.object({
	q: z.string().optional(),
});

type SearchParams = z.infer<typeof validateSearch>;

export const Route = createFileRoute("/search")({
	component: SearchPage,
	loaderDeps: ({ search }) => ({ q: search.q }),
	loader: async ({ deps }) => {
		const query = typeof deps.q === "string" ? deps.q : "";
		const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
		if (!response.ok) {
			throw new Response("Failed to load search results", {
				status: response.status,
			});
		}
		const results = await response.json();
		return { query, results };
	},
	validateSearch,
});

function SearchPage() {
	const { q } = Route.useSearch();

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
			<div className="max-w-4xl mx-auto">
				{/* Search header */}
				<div className="mb-8">
					<a href="/" className="inline-block mb-6">
						<h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
							TieBugs
						</h1>
					</a>

					<form className="flex gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<Input
								type="text"
								name="q"
								defaultValue={q}
								placeholder="Search for flies, patterns, materials..."
								className="pl-12 h-12 bg-slate-800/80 border-slate-600 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500/30"
							/>
						</div>
						<Button
							type="submit"
							className="h-12 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
						>
							Search
						</Button>
					</form>
				</div>

				{/* Search results placeholder */}
				<div className="text-center py-16">
					{q ? (
						<div>
							<p className="text-gray-400 text-lg mb-2">
								Searching for:{" "}
								<span className="text-amber-400 font-medium">"{q}"</span>
							</p>
							<p className="text-gray-500">
								No results found. Be the first to add a recipe!
							</p>
						</div>
					) : (
						<p className="text-gray-500">
							Enter a search term to find fly patterns
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
