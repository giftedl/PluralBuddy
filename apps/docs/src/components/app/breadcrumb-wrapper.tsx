import { ReactNode } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Card, CardContent } from "../ui/card";

export function BreadcrumbWrapper({ children }: { children: ReactNode }) {
	return (
		<Card className="w-full">
			<CardContent>
				<Breadcrumb className="text-left">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink>Settings</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
                        {children}
					</BreadcrumbList>
				</Breadcrumb>
			</CardContent>
		</Card>
	);
}
