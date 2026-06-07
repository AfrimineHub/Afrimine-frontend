import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EditListingForm } from '@/features/listings/components/EditListingForm';

const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <p className="text-sm text-red-600">Invalid listing.</p>
        <Link to="/my-ad" className="text-sm text-yellow-700 hover:underline mt-2 inline-block">
          Back to My Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/my-ad"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-yellow-700 mb-6"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to My Listings
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Edit listing</h1>
          <p className="text-sm text-gray-500 mt-2">Update your listing details.</p>
        </div>

        <EditListingForm listingId={id} />
      </div>
    </div>
  );
};

export default EditListingPage;
