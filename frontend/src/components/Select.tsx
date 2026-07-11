import type { Dispatch } from "react";

interface SelectProps {
	name: string;
	options: string[];
	setValue: Dispatch<React.SetStateAction<any>>
}

export function Select({ name, options, setValue }: SelectProps) {
	return (
		<select
			className="[appearance:base-select] [&::picker(select)]:[appearance:base-select]
                    [&::picker(select)]:rounded-xl hover:bg-accent-800 transition-colors du
                    [&::picker-icon]:transition-transform [&:open::picker-icon]:rotate-180
                    bg-accent-900 p-1.5 rounded-2xl font-medium px-2.5"
			onChange={(e) => {setValue(e.target.value)}}
		>
			<option value="" className="[&::checkmark]:hidden checked:bg-accent-700 hover:bg-accent-800 px-2.5" selected >
				{name}
			</option>
			{options.map((option) => (
				<option
					value={option}
					className="[&::checkmark]:hidden checked:bg-accent-700 hover:bg-accent-800 px-2.5"
				>
					{option}
				</option>
			))}
		</select>
	);
}
