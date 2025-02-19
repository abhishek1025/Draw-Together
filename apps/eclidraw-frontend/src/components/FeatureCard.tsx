'use client';

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className='flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow'>
      <div className='mb-4'>{icon}</div>
      <h3 className='text-xl font-semibold text-gray-800 mb-2'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  );
}

