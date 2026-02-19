

interface BrandTitleProps {
  title: string;
  className?: string;
}

const BrandTitle = ({ title, className }: BrandTitleProps) => {
  return (
    <span className={className}>{title}</span>
  )
}

export default BrandTitle
