// src/components/ui/select.tsx
export function Select<T extends string>({
  id,
  value,
  onValueChange,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  onValueChange: (value: T) => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onValueChange(e.target.value as T)}
      className="w-full rounded-md border border-gray-300 p-2"
      {...props}
    >
      {children}
    </select>
  );
}