

interface IconComponentProps {
  icon: React.ReactNode;
  title?: string; // Define any props you want to pass to the IconComponent here
}

const IconComponent = ({ icon, title }: IconComponentProps) => {
  return (
    <div
    className="hover:bg-hover-l dark:hover:bg-hover-d rounded py-1 px-3 md:py-2 cursor-pointer"
    >{icon}</div>
  )
}

export default IconComponent
