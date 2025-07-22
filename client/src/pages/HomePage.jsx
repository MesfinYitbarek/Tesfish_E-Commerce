import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                CitiLights
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              {isAuthenticated ? (
                <span className="text-gray-700 dark:text-gray-300">
                  Welcome, {user?.name}!
                </span>
              ) : (
                <div className="space-x-2">
                  <button className="btn-outline">Login</button>
                  <button className="btn-primary">Register</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to CitiLights
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your premier real estate platform
          </p>
          <div className="space-x-4">
            <button className="btn-primary">
              Explore Properties
            </button>
            <button className="btn-outline">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;