import React, { useEffect } from "react";
import { FormFieldProps } from "./FormFieldArray";
import { Button } from "@radix-ui/themes";
import { Trash2 } from "lucide-react";

const TextAreaField = ({
  label,
  name,
  fields,
  append,
  remove,
  register,
  placeholder,
}: FormFieldProps) => {
  useEffect(() => {
    if (fields.length === 0) {
      append(null);
    }
  }, [append, fields.length]);

  return (
    <div className="flex flex-col gap-2 p-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-2 items-center bg-neutral-200 dark:bg-neutral-800 rounded-lg p-2"
          >
            {/* <TextArea
							{...register(`${name}.${index}` as const)}
							size="3"
							placeholder="Understanding the basics of decentralized finance (DeFi) is crucial for anyone exploring the future of finance. Here’s a beginner-friendly guide. #DeFi #Blockchain #Crypto"
							className="w-full placeholder:text-xs"
						/> */}
            <textarea
              {...register(`${name}.${index}` as const)}
              rows={3}
              placeholder={placeholder}
              className="input block w-full focus:outline-none focus:shadow-sm border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 p-2 rounded-lg focus:ring-brand-600 focus:border-brand-600 placeholder:text-xs"
            />
            <Button
              size="3"
              color="tomato"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          append(null);
        }}
      >
        Add
      </Button>
    </div>
  );
};

export default TextAreaField;
