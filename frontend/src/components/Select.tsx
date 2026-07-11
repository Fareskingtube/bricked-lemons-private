import type { Dispatch } from "react";

interface SelectProps {
	name: string;
	options: string[] | number[];
	setValue: Dispatch<React.SetStateAction<any>>;
	default?: string | number;
}

export function Select({
	name,
	options,
	setValue,
	default: defaultValue,
}: SelectProps) {
	return (
		<select
			className="[appearance:base-select] [&::picker(select)]:[appearance:base-select]
                    [&::picker(select)]:rounded-xl dark:hover:bg-accent-800 hover:bg-accent-200 transition-colors
                    [&::picker-icon]:transition-transform [&:open::picker-icon]:rotate-180
                    dark:bg-accent-900 bg-accent-300 p-1.5 rounded-2xl font-medium px-2.5"
			onChange={(e) => {
				setValue(e.target.value);
			}}
		>
			<option
				value=""
				className="[&::checkmark]:hidden dark:checked:bg-accent-700 checked:bg-accent-300 
					dark:hover:bg-accent-800 hover:bg-accent-200 px-2.5"
				selected
			>
				{name}
			</option>
			{options.map((option) => (
				<option
					value={option}
					className="[&::checkmark]:hidden dark:checked:bg-accent-700 checked:bg-accent-300 
					dark:hover:bg-accent-800 hover:bg-accent-200 px-2.5"
					selected={option === defaultValue && true}
				>
					{option}
				</option>
			))}
		</select>
	);
}
