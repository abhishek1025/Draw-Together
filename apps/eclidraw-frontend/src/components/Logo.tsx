import { Shapes } from 'lucide-react';

const Logo = () => {
  return (
    <div className='flex items-center space-x-2'>
      <Shapes className='w-8 h-8 text-indigo-600' />
      <span className='text-xl font-bold text-gray-800'>DrawFlow</span>
    </div>
  );
};

export default Logo;

