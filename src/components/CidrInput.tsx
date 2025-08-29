import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { Input, InputProps } from "./Input";

type CidrInputProps = InputProps & {
    name: string;
    id?: string;
    className?: string;
    error?: boolean;
    inputIndex?: number;
    onChangeFunction?: (
        name: string,
        cidr: string,
        inputIndex: number | undefined
    ) => void; // returns combined CIDR
};

export const CidrInput = ({
    className,
    name,
    id,
    value = "",
    inputIndex,
    onChangeFunction,
    error = false,
    ...rest
}: CidrInputProps) => {
    const [segments, setSegments] = useState(["", "", "", "", ""]);

    const inputRefs = Array.from({ length: 5 }, () =>
        useRef<HTMLInputElement>(null)
    );

    useEffect(() => {
        if (value && typeof value === "string") {
            const [ipPart, maskPart] = value.split("/");
            const parts = ipPart?.split(".") || [];
            setSegments([
                parts[0] || "",
                parts[1] || "",
                parts[2] || "",
                parts[3] || "",
                maskPart || "",
            ]);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const { value, name } = e.target;
        const index = parseInt(name.split("-")[1]);
        let newValue = value;

        if (index < 4) {
            // IP part
            if (!/^\d{0,3}$/.test(value)) return;
            if (Number(value) > 255) newValue = "255";
        } else {
            // CIDR mask part
            if (!/^\d{0,2}$/.test(value)) return;
            if (Number(value) > 32) newValue = "32";
        }

        const newSegments = [...segments];
        newSegments[index] = newValue;
        setSegments(newSegments);

        // ✅ Check if all fields are empty → return ""
        const allEmpty = newSegments.every((seg) => seg === "");
        const combinedCidr = allEmpty
            ? ""
            : newSegments.slice(0, 4).join(".") +
            (newSegments[4] ? `/${newSegments[4]}` : "");

        onChangeFunction?.(name, combinedCidr, inputIndex);

        // Auto move focus
        if (index < 3 && newValue.length === 3 && Number(newValue) <= 255) {
            inputRefs[index + 1].current?.focus();
        }
        if (index === 3 && newValue.length === 3) {
            inputRefs[4].current?.focus(); // move to CIDR after last IP segment
        }
    };


    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace" && segments[index] === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    return (
        <div id={id} className={clsx("flex items-center", className)}>
            {segments.map((segment, index) => (
                <div key={index} className="w-full flex items-center">
                    <Input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        value={segment}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        maxLength={index < 4 ? 3 : 2} // CIDR max 2 digits
                        name={name ? `${name}-${index}` : undefined}
                        className={`w-12 text-center bg-slate-800 text-white rounded-md flex-grow ${error ? "border border-red-500" : ""
                            }`}
                        placeholder={index < 4 ? "0" : "24"}
                        {...rest}
                    />
                    {index < 3 && <span className="mx-1 text-gray-500">.</span>}
                    {index === 3 && <span className="mx-1 text-gray-500">/</span>}
                </div>
            ))}
        </div>
    );
};

export default CidrInput;
