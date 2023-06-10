import { Link, Outlet } from 'react-router-dom';

export const App = () => {
    return (
        <div className="main-layout">
            <nav className="bg-gray-800">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex-shrink-0">
                            <img className="max-h-16" src="/logo.png" alt="Clean Cloud Logo" />
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/about"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    About
                                </Link>
                                <Link
                                    to="/settings"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Settings
                                </Link>
                                <Link
                                    to="/github"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    GitHub
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <Outlet />
        </div>
    );
};
