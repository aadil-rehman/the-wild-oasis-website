import { getCountries } from "@/app/_lib/data-service";

// Let's imagine your colleague already built this component 😃

async function SelectCountry({ defaultCountry, name, id, className }) {
	const countries = await getCountries();

	const flag =
		countries.data.find((country) => country.name === defaultCountry)?.flag ??
		"";

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label htmlFor="nationality">Where are you from?</label>
				<img src={flag} alt="Country flag" className="h-5 rounded-sm" />
			</div>
			<select
				name={name}
				id={id}
				// Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
				defaultValue={`${defaultCountry}%${flag}`}
				className={className}
			>
				<option value="">Select country...</option>
				{countries.data.map((c) => (
					<option key={c.name} value={`${c.name}%${c.flag}`}>
						{c.name}
					</option>
				))}
			</select>
		</div>
	);
}

export default SelectCountry;
