// components/location-selector.tsx
import React, { useState, useMemo } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { MapPin } from "lucide-react";

import { ALL_US_CITIES, searchCities } from "@/config/us-locations";

interface LocationSelectorProps {
  value: string;
  onValueChange: (location: string) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onValueChange,
  isDisabled = false,
  isRequired = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!inputValue.trim()) {
      // Show top 50 cities by default to avoid overwhelming the list
      return ALL_US_CITIES.slice(0, 50);
    }

    const results = searchCities(inputValue);

    // Limit search results to 50 for performance
    return results.slice(0, 50);
  }, [inputValue]);

  return (
    <Autocomplete
      allowsCustomValue={false}
      aria-label="Select location"
      className="w-full"
      defaultItems={filteredCities}
      inputValue={inputValue}
      isDisabled={isDisabled}
      label="Location"
      placeholder="Type to search cities..."
      required={isRequired}
      scrollShadowProps={{
        isEnabled: false,
      }}
      selectedKey={value || null}
      startContent={<MapPin className="h-4 w-4 text-default-400" />}
      variant="bordered"
      onInputChange={setInputValue}
      onSelectionChange={(key) => {
        if (key) {
          onValueChange(key as string);
          // Update input value to show selected city
          const selectedCity = ALL_US_CITIES.find((c) => c.value === key);

          if (selectedCity) {
            setInputValue(selectedCity.value);
          }
        }
      }}
    >
      {(city) => (
        <AutocompleteItem key={city.value} textValue={city.value}>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{city.city}</span>
            <span className="text-xs text-default-500">
              {city.state} ({city.stateCode})
            </span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};
