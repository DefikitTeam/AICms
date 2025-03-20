import { Eye, EyeOff, CircleHelp } from "lucide-react";
import React, { useState } from "react";
import { FieldValues, UseFormRegister, Controller, Control } from "react-hook-form";
import { Tooltip } from "@radix-ui/themes";
import * as Switch from "@radix-ui/react-switch";

type InputFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  label?: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  control: Control<any>;
  isSecure?: boolean;
  description?: string;
  type?: string;
  options?: { value: string; label: string }[];
  onChange?: (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
};

function parseDescription(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

const InputField = ({
  label,
  name,
  placeholder,
  register,
  control,
  isSecure = false,
  description,
  type = "text",
  options = [],
  onChange,
}: InputFieldProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="col-span-1 p-2 bg-neutral-100 dark:bg-neutral-600 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <label className="label flex items-center gap-1 mb-1">
        <span className="label-text text-sm font-medium">{label}</span>
        {description && (
          <Tooltip
            content={
              <div className="max-w-[300px]">
                {parseDescription(description)}
              </div>
            }
          >
            <CircleHelp size={16} />
          </Tooltip>
        )}
      </label>
      {type === "boolean" ? (
        <div className="mt-1 flex items-center gap-2 p-2">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Switch.Root
                checked={field.value === "true"} 
                onCheckedChange={(checked) =>
                  field.onChange(checked ? "true" : "false")
                } 
                className="w-[42px] h-[25px] bg-gray-200 rounded-full relative data-[state=checked]:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-neutral-700 dark:data-[state=checked]:bg-blue-500"
              >
                <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            )}
          />
          <span className="text-sm text-gray-600 dark:text-neutral-300">
            {label}
          </span>
        </div>
      ) : type === "select" ? (
        <select
          {...register(name)}
          onChange={onChange}
          className="input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            {...register(name)}
            placeholder={placeholder}
            type={isSecure ? (show ? "text" : "password") : "text"}
            onChange={onChange}
            className="input block w-full focus:outline-none focus:ring-brand-600 focus:border-brand-600 focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg placeholder:text-xs"
          />
          <div className="absolute top-[50%] right-2 transform -translate-y-1/2">
            {isSecure &&
              (show ? (
                <EyeOff size={16} onClick={() => setShow(false)} />
              ) : (
                <Eye size={16} onClick={() => setShow(true)} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputField;
