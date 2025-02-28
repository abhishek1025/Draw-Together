import { FeatureCard } from '@/components/FeatureCard';
import { Github, Pencil, Share2, Users } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <header className='bg-gradient-to-r from-indigo-50 to-blue-50'>
        <div className='container mx-auto px-6 py-20'>
          <div className='flex flex-col md:flex-row items-center'>
            <div className='md:w-1/2 mb-10 md:mb-0'>
              <h1 className='text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6'>
                Collaborate and Create Beautiful Diagrams
              </h1>
              <p className='text-xl text-gray-600 mb-8'>
                A free, open-source drawing tool that lets you create and share
                diagrams, wireframes, and sketches with ease.
              </p>
              <div className='flex space-x-4'>
                <button className='bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors'>
                  Start Drawing
                </button>
                <button className='border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors'>
                  View Demo
                </button>
              </div>
            </div>
            <div className='md:w-1/2'>
              <Image
                src='https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80'
                alt='Collaborative Drawing'
                className='rounded-lg shadow-2xl'
                width='800'
                height='500'
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id='features' className='py-20'>
        <div className='container mx-auto px-6'>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-16'>
            Everything you need to create amazing diagrams
          </h2>
          <div className='grid md:grid-cols-3 gap-12'>
            <FeatureCard
              icon={<Pencil className='w-8 h-8 text-indigo-600' />}
              title='Intuitive Drawing'
              description='Simple and powerful drawing tools that feel natural and responsive.'
            />
            <FeatureCard
              icon={<Share2 className='w-8 h-8 text-indigo-600' />}
              title='Easy Sharing'
              description='Share your drawings with a simple link or export to various formats.'
            />
            <FeatureCard
              icon={<Users className='w-8 h-8 text-indigo-600' />}
              title='Real-time Collaboration'
              description='Work together with your team in real-time, see changes instantly.'
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-indigo-600 py-20'>
        <div className='container mx-auto px-6 text-center'>
          <h2 className='text-3xl font-bold text-white mb-8'>
            Start Creating Your Diagrams Today
          </h2>
          <p className='text-indigo-100 mb-8 max-w-2xl mx-auto'>
            Join thousands of users who trust DrawFlow for their diagramming
            needs. No credit card required.
          </p>
          <div className='flex justify-center space-x-4'>
            <button className='bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors'>
              Get Started Free
            </button>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2 bg-indigo-700 text-white px-8 py-3 rounded-lg hover:bg-indigo-800 transition-colors'>
              <Github className='w-5 h-5' />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


