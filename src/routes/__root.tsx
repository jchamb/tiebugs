import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { CircleUser } from "lucide-react";

import { signIn, signOut, useSession } from "@/lib/auth/client";
import type { Theme } from "@/lib/theme.server";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeToggle } from "../components/ThemeToggle";
import { TopographicBackground } from "../components/TopographicBackground";
import { Button } from "../components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import StoreDevtools from "../lib/demo-store-devtools";
import { getTheme } from "../lib/theme.server";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TieBugs - Fly Tying Community",
			},
			{
				name: "description",
				content: "Discover and share fly tying patterns with the community",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	loader: async (): Promise<{ theme: Theme | null }> => {
		const theme = (await getTheme()) as Theme | null;
		return { theme };
	},

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { theme } = Route.useLoaderData();
	const { data: session, isPending } = useSession();

	return (
		<html lang="en" className={theme ?? undefined} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body suppressHydrationWarning>
				<ThemeProvider initialTheme={theme}>
					<TopographicBackground />
					<div className="fixed top-4 right-4 z-50 flex items-center gap-4">
						<ThemeToggle />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="sm" variant="outline">
									{session ? (
										<>Profile img</>
									) : (
										<>
											<CircleUser /> Login
										</>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56" align="start">
								<DropdownMenuGroup>
									{session ? (
										<DropdownMenuItem onSelect={() => signOut()}>
											Sign out
										</DropdownMenuItem>
									) : (
										<>
											<DropdownMenuItem
												onSelect={() => signIn.social({ provider: "google" })}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
												>
													<title>Google</title>
													<path
														d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
														fill="currentColor"
													/>
												</svg>
												Google
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={() => signIn.social({ provider: "facebook" })}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
												>
													<title>Facebook/Meta</title>
													<path
														d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
														fill="currentColor"
													></path>
												</svg>
												Facebook/Meta
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={() => signIn.social({ provider: "twitter" })}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
												>
													<title>X</title>
													<path
														d="M14.054934,10.1623621 L22.09602,0 L20.19054,0 L13.208466,8.8238362 L7.631904,0 L1.2,0 L9.632856,13.3432031 L1.2,24 L3.105588,24 L10.478838,14.681729 L16.368096,24 L22.8,24 L14.054466,10.1623621 L14.054934,10.1623621 Z M11.44497,13.4607598 L10.590546,12.1320776 L3.792198,1.55961545 L6.71907,1.55961545 L12.205416,10.0919298 L13.05984,11.4206121 L20.19144,22.5113139 L17.264568,22.5113139 L11.44497,13.4612686 L11.44497,13.4607598 Z"
														fill="currentColor"
													></path>
												</svg>
												X
											</DropdownMenuItem>
											<DropdownMenuItem
												onSelect={() => signIn.social({ provider: "github" })}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
												>
													<title>Github</title>
													<path
														d="M11.9642449,0 C5.34832653,0 0,5.3877551 0,12.0531429 C0,17.3811429 3.42685714,21.8911837 8.18081633,23.4874286 C8.77518367,23.6074286 8.99289796,23.2280816 8.99289796,22.9089796 C8.99289796,22.629551 8.97330612,21.6717551 8.97330612,20.6737959 C5.64514286,21.3923265 4.95208163,19.2369796 4.95208163,19.2369796 C4.41722449,17.8400816 3.62473469,17.4810612 3.62473469,17.4810612 C2.53542857,16.7426939 3.70408163,16.7426939 3.70408163,16.7426939 C4.91240816,16.8225306 5.54644898,17.9799184 5.54644898,17.9799184 C6.61591837,19.8156735 8.33926531,19.2969796 9.03257143,18.9776327 C9.1315102,18.1993469 9.44865306,17.6605714 9.78538776,17.3613061 C7.13093878,17.0818776 4.33812245,16.0442449 4.33812245,11.414449 C4.33812245,10.0973878 4.81322449,9.01983673 5.56604082,8.18179592 C5.44726531,7.88253061 5.03118367,6.64506122 5.68506122,4.98881633 C5.68506122,4.98881633 6.69526531,4.66946939 8.97306122,6.22604082 C9.94826666,5.96220309 10.9539802,5.82798718 11.9642449,5.82685714 C12.974449,5.82685714 14.0042449,5.96669388 14.9551837,6.22604082 C17.2332245,4.66946939 18.2434286,4.98881633 18.2434286,4.98881633 C18.8973061,6.64506122 18.4809796,7.88253061 18.3622041,8.18179592 C19.1348571,9.01983673 19.5903673,10.0973878 19.5903673,11.414449 C19.5903673,16.0442449 16.797551,17.0617959 14.1232653,17.3613061 C14.5591837,17.7404082 14.9353469,18.4586939 14.9353469,19.5962449 C14.9353469,21.2125714 14.9157551,22.5097959 14.9157551,22.9087347 C14.9157551,23.2280816 15.1337143,23.6074286 15.7278367,23.4876735 C20.4817959,21.8909388 23.9087065,17.3811429 23.9087065,12.0531429 C23.9282449,5.3877551 18.5603265,0 11.9642449,0 Z"
														fill="currentColor"
													></path>
												</svg>
												Github
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<Outlet />
					{/* {children} */}
				</ThemeProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
						StoreDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
