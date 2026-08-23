import { Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SecuritySettings = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock size={18} />
          <div>
            <p className="text-sm font-medium">Change Password</p>
            <p className="text-xs text-gray-500">Update your password regularly</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/change-password')}
          className="text-sm text-blue-600 cursor-pointer"
        >
          Update
        </button>
      </div>

      <div className="flex items-center justify-between opacity-60">
        <div className="flex items-center gap-3">
          <Shield size={18} />
          <div>
            <p className="text-sm font-medium">Two-Factor Authentication</p>
            <p className="text-xs text-gray-500">Coming soon</p>
          </div>
        </div>
        <button disabled className="text-sm text-gray-400 cursor-not-allowed">
          Enable
        </button>
      </div>
    </div>
  );
};