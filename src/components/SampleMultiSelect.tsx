import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";

import { usePublishFormContext } from "@/context";
import { Spinner } from "./Spinner";

function SampleMultiSelect({ onClick }: { onClick?: () => void }) {
	const { publishState, setPublishState } = usePublishFormContext();

	const options = publishState.sampleItems;
	const loading = publishState.sampleItemsIsLoading;
	const selectedValues = new Set(publishState.sampleSelectedValues);

	return (
		<Popover>
			<PopoverTrigger
				asChild
				className="justify-start"

				// disabled={!loading && !publishState.sampleItems.length ? true : false}
			>
				<Button
					variant="outline"
					className="bg-transparent text-sm"
					onClick={onClick}
				>
					<Plus className="mr-2 h-4 w-4" />
					Add Sample
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{selectedValues.size}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.size > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{selectedValues.size} selected
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit  p-0" align="start">
				<Command>
					<CommandInput placeholder={"Sample"} />
					<CommandList>
						<CommandEmpty>
							{loading ? (
								<Spinner className=" mx-auto border-t-foreground" />
							) : (
								"No results found! Upload a file"
							)}
						</CommandEmpty>

						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);

								return (
									<CommandItem
										key={option.label}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value);
											} else {
												selectedValues.add(option.value);
											}
											const sampleSelectedValues = Array.from(selectedValues);
											setPublishState({
												...publishState,
												sampleSelectedValues,
											});
										}}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<Check className={cn("h-4 w-4")} />
										</div>
										<span>{option.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => {
											setPublishState({
												...publishState,
												sampleSelectedValues: [],
											});
										}}
										className="justify-center text-center"
									>
										Clear
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default SampleMultiSelect;
