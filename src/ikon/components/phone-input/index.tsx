import { cn } from '@/shadcn/lib/utils'
import { Button } from '@/shadcn/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shadcn/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { countries } from 'countries-list'
import * as Flags from "country-flag-icons/react/3x2";

const Flag = ({ code }: { code: string }) => {
    const FlagComponent = Flags[code as keyof typeof Flags];
    return <FlagComponent />;
};

function PhoneInput({ className, ...props }: any) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>("")
    const [countryCode, setCountryCode] = useState<string>("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {countryCode
                        ? <Flag code={countryCode} />
                        : "..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align='start'>
                <Command
                    filter={(value, search, keywords = []) => {
                        const extendValue = value.toLowerCase() + ' ' + keywords.join(' ').toLowerCase()
                        if (extendValue.includes(search.toLowerCase())) return 1
                        return 0
                    }}

                >
                    <CommandInput placeholder="Search ..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {Object.entries(countries).map(([code, country]) => (
                                country.phone.map((phone) =>
                                    <CommandItem
                                        key={phone}
                                        value={`${phone}`}
                                        keywords={[country.name, "+" + phone.toString(), code]}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setCountryCode(code)
                                            setOpen(false)
                                        }}
                                        //className={(value == phone.toString()) ? "bg-accent" : ""}
                                    >
                                        <Flag code={code} /> {country.name} +{phone}

                                    </CommandItem>
                                )
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default PhoneInput