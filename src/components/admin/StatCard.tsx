import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  className?: string;
};

const baseContainerClassName =
  'bg-card-l dark:bg-card-d p-6 rounded border border-border-l dark:border-border-d';

const baseValueClassName = 'text-3xl font-bold';

export function StatCard({ label, value, valueClassName = '', className = '' }: StatCardProps) {
  const containerClassName = `${baseContainerClassName} ${className}`.trim();
  const valueClass = `${baseValueClassName} ${valueClassName}`.trim();

  return (
    <div className={containerClassName}>
      <p className="text-sm font-medium  mb-2">{label}</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}
