import { forwardRef, type InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
};

const baseInputClassName =
  'w-full px-4 py-2.5 text-base border border-border-l dark:border-border-d rounded bg-card-l dark:bg-card-d placeholder:text-placeholder-l dark:placeholder:text-placeholder-d focus:outline-none focus:border-primary dark:focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    containerClassName = '',
    labelClassName = 'block text-sm font-medium mb-1',
    id,
    className = '',
    ...props
  },
  ref
) {
  const inputId = id ?? props.name;

  return (
    <div className={containerClassName}>
      {label && inputId ? (
        <label htmlFor={inputId} className={labelClassName}>
          {label}
        </label>
      ) : label ? (
        <span className={labelClassName}>{label}</span>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={`${baseInputClassName} ${className}`.trim()}
        {...props}
      />
    </div>
  );
});
