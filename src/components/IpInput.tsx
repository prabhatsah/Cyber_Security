
import { useState } from 'react';
import { Input } from './Input';

export function IpInputTremor() {
  const [ip, setIp] = useState(['', '', '', '']);

  const handleChange = (index: number, value: string) => {
    const newIp = [...ip];
    
    if (/^\d*$/.test(value) && (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 255))) {
      newIp[index] = value;
      
      if (value.length === 3 && index < 3) {
        document.getElementById(`ip-part-${index + 1}`)?.focus();
      }
      
      setIp(newIp);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {ip.map((part, index) => (
        <div key={index} className="flex items-center">
          <Input
            id={`ip-part-${index}`}
            type="text"
            value={part}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-12 text-center"
            maxLength={3}
          />
          {index < 3 && <span className="mx-1 text-gray-500">.</span>}
        </div>
      ))}
    </div>
  );
}