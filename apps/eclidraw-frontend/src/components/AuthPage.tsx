export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600'>
      <div className='p-8 bg-white rounded-lg shadow-2xl w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
          {isSignIn ? 'Welcome Back!' : 'Create an Account'}
        </h1>

        <div className='space-y-6'>
          <input
            type='text'
            placeholder='Email'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-transparent transition-all'
          />
          <input
            type='password'
            placeholder='Password'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-transparent transition-all'
          />
        </div>

        <button className='w-full mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition-all'>
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </button>

        <p className='mt-6 text-center text-gray-600'>
          {isSignIn ? "Don't have an account? " : 'Already have an account? '}
          <a
            href={isSignIn ? '/signup' : '/signin'}
            className='text-blue-600 hover:underline'>
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </a>
        </p>
      </div>
    </div>
  );
}

