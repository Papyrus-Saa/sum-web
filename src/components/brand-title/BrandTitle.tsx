interface BrandTitleProps {
  title: string;
  className?: string;
}

const BrandTitle = ({ title, className }: BrandTitleProps): React.ReactElement => {
  return <span className={`${className || ''} py-1`}>{title}</span>;
};

export default BrandTitle;
