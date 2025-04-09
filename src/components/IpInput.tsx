import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { Input, InputProps } from "./Input";

type IpInputProps = InputProps & {
  name: string;
  id?: string;
  className?: string;
  error?: boolean;
  onChangeFunction?: (name: string, ip: string) => void; // returns combined IP
};

export const IpInput = ({
  className,
  name,
  id,
  value = "",
  onChangeFunction,
  error = false,
  ...rest
}: IpInputProps) => {
  const [segments, setSegments] = useState(["", "", "", ""]);

  const inputRefs = Array.from({ length: 4 }, () =>
    useRef<HTMLInputElement>(null)
  );

  useEffect(() => {
    if (value && typeof value === 'string') {
      const parts = value.split(".");
      setSegments([
        parts[0] || "",
        parts[1] || "",
        parts[2] || "",
        parts[3] || "",
      ]);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { value, name } = e.target;
    const index = parseInt(name.split("-")[1]);

    if (!/^\d{0,3}$/.test(value)) return; // Allow only numbers up to 3 digits

    let newValue = value;

    if (Number(value) > 255) {
      newValue = "255"; // Restrict to max 255
    }

    const newSegments = [...segments];
    newSegments[index] = newValue;
    setSegments(newSegments);

    const combinedIp = newSegments.join(".");
    onChangeFunction?.(name, combinedIp);

    if (newValue.length === 3 && Number(newValue) <= 255 && index < 3) {
      inputRefs[index + 1].current?.focus();
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
    <div id={id} className={clsx("flex items-center gap-2", className)}>
      {segments.map((segment, index) => (
        <div key={index} className="w-full flex items-center">
          <Input
            key={index}
            ref={inputRefs[index]}
            type="text"
            value={segment}
            onChange={handleChange}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={3}
            name={name ? `${name}-${index}` : undefined}
            className={`w-12 text-center bg-slate-800 text-white rounded-md flex-grow ${error ? "border border-red-500" : ""}`}
            // className="w-12 text-center bg-slate-800 text-white rounded-md flex-grow"
            placeholder="0"
            {...rest}
          />
          {index < 3 && <span className="mx-1 text-gray-500">.</span>}
        </div>
      ))}
    </div>
  );
};

export default IpInput;
