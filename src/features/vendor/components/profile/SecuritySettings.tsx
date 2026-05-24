import { Lock, Shield } from "lucide-react";

export const SecuritySettings = () => {
  return (
    <div className="space-y-4">
      {/* Change Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock size={18} />
          <div>
            <p className="text-sm font-medium">Change Password</p>
            <p className="text-xs text-gray-500">
              Update your password regularly
            </p>
          </div>
        </div>

        <button className="text-sm text-blue-600 cursor-pointer">Update</button>
      </div>

      {/* 2FA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={18} />
          <div>
            <p className="text-sm font-medium">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-gray-500">
              Add an extra layer of security
            </p>
          </div>
        </div>

        <button className="text-sm text-blue-600 cursor-pointer">Enable</button>
      </div>
    </div>
  );
};