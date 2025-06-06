import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AmericanDateInputProps {
  value: string; // Expected in YYYY-MM-DD format
  onChange: (value: string) => void; // Returns YYYY-MM-DD format
  placeholder?: string;
  required?: boolean;
  className?: string;
  id?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const AmericanDateInput: React.FC<AmericanDateInputProps> = ({
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  required = false,
  className = "",
  id,
  label,
  error,
  disabled = false
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Convert YYYY-MM-DD to MM/DD/YYYY for display
  const formatToAmerican = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate + 'T00:00:00'); // Add time to prevent timezone issues
    if (isNaN(date.getTime())) return '';
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  };

  // Convert MM/DD/YYYY to YYYY-MM-DD
  const formatToISO = (americanDate: string): string => {
    if (!americanDate) return '';
    
    // Remove any non-numeric characters except slashes
    const cleaned = americanDate.replace(/[^\d\/]/g, '');
    const parts = cleaned.split('/');
    
    if (parts.length !== 3) return '';
    
    const [month, day, year] = parts;
    
    // Validate parts
    if (!month || !day || !year) return '';
    if (month.length > 2 || day.length > 2 || year.length !== 4) return '';
    
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    const yearNum = parseInt(year, 10);
    
    // Basic validation
    if (monthNum < 1 || monthNum > 12) return '';
    if (dayNum < 1 || dayNum > 31) return '';
    if (yearNum < 1900 || yearNum > 2100) return '';
    
    // Create date to validate it's a real date
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getFullYear() !== yearNum || 
        date.getMonth() !== monthNum - 1 || 
        date.getDate() !== dayNum) {
      return '';
    }
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Update display value when prop value changes
  useEffect(() => {
    setDisplayValue(formatToAmerican(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove any non-numeric characters except slashes
    inputValue = inputValue.replace(/[^\d\/]/g, '');
    
    // Auto-add slashes
    if (inputValue.length >= 2 && !inputValue.includes('/')) {
      inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
    }
    if (inputValue.length >= 5 && inputValue.split('/').length === 2) {
      const parts = inputValue.split('/');
      inputValue = parts[0] + '/' + parts[1].slice(0, 2) + '/' + parts[1].slice(2);
    }
    
    // Limit length to MM/DD/YYYY format
    if (inputValue.length <= 10) {
      setDisplayValue(inputValue);
      
      // Try to convert to ISO format and call onChange
      const isoDate = formatToISO(inputValue);
      onChange(isoDate);
    }
  };

  const handleBlur = () => {
    // On blur, ensure the format is complete or clear it
    if (displayValue && displayValue.length < 10) {
      setDisplayValue('');
      onChange('');
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-medical-text-primary font-medium">
          {label}
          {required && <span className="text-medical-error ml-1">*</span>}
        </Label>
      )}
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`border-medical-border focus:border-medical-primary focus:ring-medical-primary/20 ${className}`}
        required={required}
        disabled={disabled}
        maxLength={10}
      />
      {error && (
        <p className="text-medical-error text-sm">{error}</p>
      )}
      <p className="text-xs text-medical-text-secondary">
        Enter date in MM/DD/YYYY format
      </p>
    </div>
  );
};

// Utility functions for date validation and formatting
export const DateUtils = {
  // Validate if a date string in MM/DD/YYYY format is valid
  isValidAmericanDate: (dateString: string): boolean => {
    if (!dateString) return false;
    const parts = dateString.split('/');
    if (parts.length !== 3) return false;
    
    const [month, day, year] = parts.map(part => parseInt(part, 10));
    
    if (isNaN(month) || isNaN(day) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > 2100) return false;
    
    // Check if it's a valid date
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  },

  // Convert YYYY-MM-DD to MM/DD/YYYY
  isoToAmerican: (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate + 'T00:00:00');
    if (isNaN(date.getTime())) return '';
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  },

  // Convert MM/DD/YYYY to YYYY-MM-DD
  americanToIso: (americanDate: string): string => {
    if (!americanDate) return '';
    
    const parts = americanDate.split('/');
    if (parts.length !== 3) return '';
    
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  },

  // Get today's date in American format
  getTodayAmerican: (): string => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    
    return `${month}/${day}/${year}`;
  },

  // Get today's date in ISO format
  getTodayISO: (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  },

  // Validate if a date is at least X days in the future
  isDateFutureMinDays: (isoDate: string, minDays: number = 0): boolean => {
    if (!isoDate) return false;
    
    const inputDate = new Date(isoDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    
    return inputDate >= minDate;
  }
};