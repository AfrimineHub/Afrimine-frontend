export const ProfilePhoto = () => {
    return (
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 cursor-pointer">
          JD
        </div>
  
        {/* Upload */}
        <div>
          <p className="text-sm font-medium">Upload New Photo</p>
          <p className="text-xs text-gray-500">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>
    );
  };