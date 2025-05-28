import React, { SetStateAction, useEffect } from 'react';
import countryData from '../../constants/targetCountries';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import { View } from 'react-native';
import SelectMenu from '../form/SelectMenu';

export default function LocationSelectMenu({
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity
}: {
  selectedCountry: string | null,
  setSelectedCountry: any,
  selectedState: string | null,
  setSelectedState: any,
  selectedCity: string | null,
  setSelectedCity: any
}) {
  const countriesList = countryData.map((country) => country.name);

  const [countries, setCountries] = React.useState<{ name: string, id: number }[] | null>(null);
  const [selectedCountryId, setSelectedCountryId] = React.useState<number | null>(null);
  const [states, setStates] = React.useState<{ name: string, id: number }[] | null>(null);
  const [selectedStateId, setSelectedStateId] = React.useState<number | null>(null);
  const [cities, setCities] = React.useState<{ name: string, id: number }[] | null>(null);

  // Initialize countries and preselected country ID
  useEffect(() => {
    GetCountries().then((allCountries) => {
      const filteredCountries = allCountries.filter((country) =>
        countriesList.includes(country.name)
      );
      setCountries(filteredCountries);

      if (selectedCountry) {
        const country = filteredCountries.find(c => c.name === selectedCountry);
        if (country) {
          setSelectedCountryId(country.id);
        }
      }
    });
  }, []);

  // Load states when country ID changes or when countries load with preselected country
  useEffect(() => {
    if (selectedCountryId) {
      GetState(selectedCountryId).then((statesData) => {
        setStates(statesData);

        if (selectedState) {
          const state = statesData.find(s => s.name === selectedState);
          if (state) {
            setSelectedStateId(state.id);
          }
        }
      });
    } else {
      setStates(null);
      setSelectedStateId(null);
    }
  }, [selectedCountryId]);

  // Load cities when state ID changes or when states load with preselected state
  useEffect(() => {
    if (selectedStateId && selectedCountryId) {
      GetCity(selectedCountryId, selectedStateId).then((citiesData) => {
        setCities(citiesData);

        if (selectedCity) {
          const city = citiesData.find(c => c.name === selectedCity);
          if (!city) {
            // If the preselected city isn't found, clear it
            setSelectedCity(null);
          }
        }
      });
    } else {
      setCities(null);
    }
  }, [selectedStateId, selectedCountryId]);

  // Handle country selection
  const handleCountrySelect = (countryName: string | null) => {
    setSelectedCountry(countryName);
    setSelectedState(null);
    setSelectedCity(null);

    if (countryName && countries) {
      const country = countries.find(c => c.name === countryName);
      setSelectedCountryId(country?.id || null);
    } else {
      setSelectedCountryId(null);
    }
  };

  // Handle state selection
  const handleStateSelect = (stateName: string | null) => {
    setSelectedState(stateName);
    setSelectedCity(null);

    if (stateName && states) {
      const state = states.find(s => s.name === stateName);
      setSelectedStateId(state?.id || null);
    } else {
      setSelectedStateId(null);
    }
  };

  // Handle city selection
  const handleCitySelect = (cityName: string | null) => {
    setSelectedCity(cityName);
  };

  return (
    <View style={{ gap: 16 }}>
      <SelectMenu
        placeholder='Select Country'
        options={countries?.map((country) => country.name) || []}
        onSelect={handleCountrySelect}
        selected={selectedCountry}
      />
      <SelectMenu
        placeholder='Select State'
        options={states?.map((state) => state.name) || []}
        onSelect={handleStateSelect}
        selected={selectedState}
        error={!selectedCountry ? 'Please select a country first' : false}
      />
      <SelectMenu
        placeholder='Select District/City'
        options={cities?.map((city) => city.name) || []}
        onSelect={handleCitySelect}
        selected={selectedCity}
        error={!selectedState ? 'Please select a state first' : false}
      />
    </View>
  );
}
