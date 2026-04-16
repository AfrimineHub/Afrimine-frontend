export const SectionCard = ({
    title,
    subtitle,
    children,
  }: any) => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
  
        {children}
      </div>
    );
  };