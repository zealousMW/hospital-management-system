"use client"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form";
import { formF } from "./patient";
import Image from "next/image";
import React, { useState } from 'react';

  interface CustomFormProps {
    control: Control<any>,
    formFields: formF,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateForm?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?:(field:any) => React.ReactNode


  }

  const RenderField = ({field, props }:{field:any; props:CustomFormProps}) => {
    const {control, formFields, name, label, placeholder, iconSrc, iconAlt} = props;
    switch (formFields) {
      case formF.INPUT:
        return (
          
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
                {iconSrc && (
                    <Image
                    src={iconSrc}
                    alt={iconAlt || "icon"}
                    width={24}
                    height={24}
                    className="ml-2"
                    
                    />
                )}
                <FormControl>
                    <Input
                     placeholder={placeholder}
                        {...field}
                        className="shad-input border-0"
                    />
                </FormControl>

            </div>

        );
        case formF.PASS:
            const [showPassword, setShowPassword] = useState(false);
            const [inputValue, setInputValue] = useState(field.value || '');
        return (
          
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
                {iconSrc && (
                    <Image
                    src={iconSrc}
                    alt={iconAlt || "icon"}
                    width={24}
                    height={24}
                    className="ml-2"
                    
                    />
                )}
                <FormControl>
                    <Input
                     placeholder={placeholder}
                     type={showPassword ? "text" : "password"}
                     value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                        {...field}
                        className="shad-input border-0"
                    />
                    
                </FormControl>
                <Image
                            src={showPassword ? "/asserts/icon/viewpass.svg" : "/asserts/icon/closepass.svg"}
                            alt="view password"
                            width={24}
                            height={24}
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-2 mr-2"
                        />
                          
                        

            </div>

        );
      case formF.TEXTAREA:
        return (
          <Input
            {...field}
            type="textarea"
            placeholder={placeholder}
            iconSrc={iconSrc}
            iconAlt={iconAlt}
          />
        );
      case formF.SELECT:
        return (
          <Input
            {...field}
            type="select"
            placeholder={placeholder}
            iconSrc={iconSrc}
            iconAlt={iconAlt}
          />
        );
      case formF.CHECKBOX:
        return (
          <Input
            {...field}
            type="checkbox"
            placeholder={placeholder}
            iconSrc={iconSrc}
            iconAlt={iconAlt}
          />
        );
      default:
        return (
          <Input
            {...field}
            type="text"
            placeholder={placeholder}
            iconSrc={iconSrc}
            iconAlt={iconAlt}
          />
        );
    }
  }

const CustomForm = (props : CustomFormProps) =>{
    const {control, formFields, name, label, placeholder, iconSrc, iconAlt} = props;

    return (
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex-1">
                {formFields !== formF.CHECKBOX && label && (
                <FormLabel >{label}</FormLabel>
                )}

                <RenderField field={field} props={props}/>
              
              <FormMessage />
            </FormItem>
          )}
        />

    );
}

export default CustomForm;