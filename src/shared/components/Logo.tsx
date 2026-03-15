import { Link } from "react-router-dom";

const Logo = ({ className = "" }) => {
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 ${className}`}
      >
      <img
        src="/images/afrimine-logo.jpeg"
        alt="Afrimine logo"
        className="w-8 h-8 object-contain rounded-lg"
      />

      <span className="text-lg font-bold tracking-tight">
        Afrimine
      </span>
    </Link>
  );
};

export default Logo;