"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buildingAddressSchema } from "../../lib/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";

import { useState, useEffect, useRef } from "react";

import { Country, State, City } from "country-state-city";

type AddressValues = z.infer<typeof buildingAddressSchema>;

interface AddressFormProps {
  defaultValues?: AddressValues;
  onSubmit: (values: AddressValues) => void;
}

const AddressForm = ({ defaultValues, onSubmit }: AddressFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const initialAddress = defaultValues?.address || {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    latitude: 0,
    longitude: 0,
  };

  const form = useForm<AddressValues>({
    resolver: zodResolver(buildingAddressSchema),
    defaultValues: {
      address: initialAddress,
    },
  });

  useEffect(() => {
    (window as any).submitAddressForm = () => {
      console.log("Address manual form submission triggered");
      form.handleSubmit(handleFormSubmit)();
    };
  }, [form]);

  const handleFormSubmit = (values: AddressValues) => {
    console.log("Address form submitting with data:", values);
    onSubmit(values);
  };

  const [country, setCountry] = useState("IN");
  const [state, setState] = useState("WB");
  const [city, setCity] = useState("Kolkata");
  const [cities, setCities] = useState(
    City.getCitiesOfState(country, state).map((city) => ({
      value: city.name,
      label: city.name,
    }))
  );
  const [states, setStates] = useState(
    State.getStatesOfCountry(country).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }))
  );

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setStates(
      State.getStatesOfCountry(value).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    );

    setState(states[0].value);
  };
  const handleStateChange = (value: string) => {
    setState(value);
    setCities(
      City.getCitiesOfState(country, value).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    );
    setCity(cities[0].value);
  };
  const handleCityChange = (value: string) => {
    setCity(value);
  };

  const countries = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address.street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCityChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleStateChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="address.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip/Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter zip code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleCountryChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="address.latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Enter latitude (e.g. 22.5726)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Enter longitude (e.g. 88.3639)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <button 
          type="submit" 
          id="address-form-submit" 
          style={{ display: 'none' }}
        >
          Submit
        </button>

        <button 
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => {
            console.log("Address submit button clicked");
            form.handleSubmit(handleFormSubmit)();
          }}
        >
          Submit
        </button>
      </form>
    </Form>
  );
};

export default AddressForm;