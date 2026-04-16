export const VerificationSection = ({
    title,
    subtitle,
    children,
  }: any) => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
  
        {children}
      </div>
    );
  };