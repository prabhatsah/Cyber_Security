'use client';

import React, { useState } from 'react';

import { IconButton } from '@/ikon/components/buttons';
import { Trash2 } from 'lucide-react';
import { Input } from '@/shadcn/ui/input';



interface IPRangeInputProps {
  onChange?: (value: { start: string; end: string }) => void;
  onDelete?: () => void;
  defaultValue?: { start: string; end: string };
  className?: string;
}

const isValidIPAddress = (ip: string): boolean => {
  const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!pattern.test(ip)) return false;

  const parts = ip.split('.').map(Number);
  return parts.every(part => part >= 0 && part <= 255);
};

const isValidOctet = (value: string): boolean => {
  const num = parseInt(value);
  return !isNaN(num) && num >= 0 && num <= 255 && value === num.toString();
};

const IPRangeInput: React.FC<IPRangeInputProps> = ({
  onChange,
  onDelete,
  defaultValue,
  className,
}) => {
  const [startIP, setStartIP] = useState(defaultValue?.start || '');
  const [endIP, setEndIP] = useState(defaultValue?.end || '');
  const [error, setError] = useState<string>('');

  const focusNextInput = (type: 'start' | 'end', currentPosition: number) => {
    let nextInput: HTMLInputElement | null = null;
    
    if (currentPosition < 3) {
      // Move to next octet in same IP
      nextInput = document.querySelector(
        `input[name="${type}-ip-${currentPosition + 1}"]`
      ) as HTMLInputElement;
    } else if (type === 'start') {
      // Move from last octet of start IP to first octet of end IP
      nextInput = document.querySelector(
        'input[name="end-ip-0"]'
      ) as HTMLInputElement;
    }

    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  };

  const handleIPChange = (
    value: string,
    type: 'start' | 'end',
    position: number
  ) => {
    const currentIP = type === 'start' ? startIP : endIP;
    const parts = currentIP.split('.');
    parts[position] = value;

    // Only allow numbers
    if (value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    const newIP = parts.join('.');
    
    if (type === 'start') {
      setStartIP(newIP);
    } else {
      setEndIP(newIP);
    }

    // Clear error if input is empty or valid
    if (value === '' || isValidOctet(value)) {
      setError('');
    }

    // Auto-move to next input only when three digits are entered and the number is valid
    if (value.length === 3 && isValidOctet(value)) {
      focusNextInput(type, position);
    }

    if (isValidIPAddress(newIP)) {
      onChange?.({ start: type === 'start' ? newIP : startIP, end: type === 'end' ? newIP : endIP });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentPosition: number,
    type: 'start' | 'end'
  ) => {
    if (e.key === '.') {
      e.preventDefault();
      focusNextInput(type, currentPosition);
    } else if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') {
      e.preventDefault();
      const prevInput = document.querySelector(
        `input[name="${type}-ip-${currentPosition - 1}"]`
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  };

  const renderIPInputGroup = (type: 'start' | 'end') => {
    const ip = type === 'start' ? startIP : endIP;
    const parts = ip.split('.');

    return (
      <div className="flex items-center gap-1 mb-2">
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <Input
              name={`${type}-ip-${i}`}
              className="w-[4rem] text-center"
              value={parts[i] || ''}
              onChange={(e) => handleIPChange(e.target.value, type, i)}
              onKeyDown={(e) => handleKeyDown(e, i, type)}
              maxLength={3}
              placeholder="0"
            />
            {i < 3 && <span className="text-lg">.</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        {renderIPInputGroup('start')}
        <span className="text-lg">to</span>
        {renderIPInputGroup('end')}
        {onDelete && (
          <IconButton
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default IPRangeInput;