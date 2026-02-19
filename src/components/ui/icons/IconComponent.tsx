interface IconComponentProps {
  icon: React.ReactNode;
  title?: string;
}

const IconComponent = ({ icon, title }: IconComponentProps): React.ReactElement => {
  return (
    <div
      className="hover:bg-hover-l dark:hover:bg-hover-d rounded py-1 px-3 md:py-2 cursor-pointer"
      title={title}
    >
      {icon}
    </div>
  );
};

export default IconComponent;
