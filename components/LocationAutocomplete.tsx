import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, TrendingUp } from 'lucide-react';
import { LOCALITIES } from '../constants';

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
    value,
    onChange,
    placeholder = 'Search localities in Trivandrum...'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Popular localities to show when empty
    const popularLocalities = [
        'Kowdiar',
        'Pattom',
        'Vazhuthacaud',
        'Kazhakkoottam',
        'Vellayambalam'
    ];

    useEffect(() => {
        // Filter localities based on input
        if (value) {
            const filtered = LOCALITIES.filter(locality =>
                locality.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered.slice(0, 8)); // Show max 8 results
        } else {
            setFilteredOptions(popularLocalities);
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (locality: string) => {
        onChange(locality);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                />
            </div>

            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                    {!value && (
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                            Popular Localities
                        </div>
                    )}
                    {filteredOptions.map((locality, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(locality)}
                            className="w-full px-4 py-3 hover:bg-blue-50 flex items-center gap-3 text-left transition-colors cursor-pointer border-b border-gray-100 last:border-none"
                        >
                            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-gray-900">{locality}</span>
                            {popularLocalities.includes(locality) && !value && (
                                <TrendingUp className="w-4 h-4 text-orange-500 ml-auto" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
