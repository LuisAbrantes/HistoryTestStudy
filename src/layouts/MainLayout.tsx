import { ReactNode, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBars,
    FaTimes,
    FaHome,
    FaBook,
    FaLightbulb,
    FaFlag,
    FaUsers
} from 'react-icons/fa';
import { IoMdResize } from 'react-icons/io';

// Import topic data
import topicsData from '../data/topics.json';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [readingMode, setReadingMode] = useState(false);
    const location = useLocation();
    const { topics } = topicsData;

    // Extract current path to highlight active links
    const currentPath = location.pathname.split('/')[1] || 'home';

    // Function to render breadcrumbs based on current location
    const renderBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(p => p);

        if (paths.length === 0) return <span>Início</span>;

        return (
            <div className="flex items-center text-sm text-gray-600">
                <NavLink to="/" className="hover:text-blue-600">
                    História
                </NavLink>

                {paths.map((path, index) => {
                    // Find the topic title from our data
                    const topic = topics.find(t => t.id === path);
                    const title = topic
                        ? topic.title
                        : path.charAt(0).toUpperCase() + path.slice(1);

                    // For the last item (current page), don't make it a link
                    if (index === paths.length - 1) {
                        return (
                            <span key={path}>
                                <span className="mx-2">›</span>
                                <span className="font-medium text-gray-800">
                                    {title}
                                </span>
                            </span>
                        );
                    }

                    // Build the cumulative path for each breadcrumb link
                    const linkPath = '/' + paths.slice(0, index + 1).join('/');

                    return (
                        <span key={path}>
                            <span className="mx-2">›</span>
                            <NavLink
                                to={linkPath}
                                className="hover:text-blue-600"
                            >
                                {title}
                            </NavLink>
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div
            className={`min-h-screen flex ${
                readingMode ? 'bg-amber-50' : 'bg-gray-100'
            }`}
        >
            {/* Sidebar - adaptado para responsividade com Tailwind */}
            {!readingMode && (
                <motion.div
                    className="bg-blue-900 text-white fixed inset-y-0 left-0 z-50 overflow-y-auto"
                    initial={{ width: sidebarOpen ? 250 : 0 }}
                    animate={{ width: sidebarOpen ? 250 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ maxHeight: '100vh' }}
                >
                    <div className="p-4 h-full flex flex-col">
                        <div className="flex items-center justify-between sticky top-0 bg-blue-900 py-2 z-10">
                            <h2
                                className={`font-bold text-xl ${
                                    !sidebarOpen && 'hidden'
                                }`}
                            >
                                História
                            </h2>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded hover:bg-blue-800"
                            >
                                {sidebarOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>

                        {sidebarOpen && (
                            <>
                                <nav className="flex-grow mt-6 overflow-y-auto">
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            `flex items-center p-3 rounded mb-1 hover:bg-blue-800 ${
                                                isActive ? 'bg-blue-700' : ''
                                            }`
                                        }
                                    >
                                        <FaHome className="mr-3" />
                                        <span>Início</span>
                                    </NavLink>

                                    {topics.map(topic => (
                                        <div key={topic.id} className="mb-4">
                                            <NavLink
                                                to={`/${topic.id}`}
                                                className={({ isActive }) =>
                                                    `flex items-center p-3 rounded mb-1 hover:bg-blue-800 ${
                                                        isActive ||
                                                        currentPath === topic.id
                                                            ? 'bg-blue-700'
                                                            : ''
                                                    }`
                                                }
                                            >
                                                {topic.id === 'napoleao' && (
                                                    <FaFlag className="mr-3" />
                                                )}
                                                {topic.id === 'liberalismo' && (
                                                    <FaBook className="mr-3" />
                                                )}
                                                {topic.id ===
                                                    'revolucoes-liberais' && (
                                                    <FaLightbulb className="mr-3" />
                                                )}
                                                {topic.id === 'socialismos' && (
                                                    <FaUsers className="mr-3" />
                                                )}
                                                <span>{topic.title}</span>
                                            </NavLink>

                                            {/* Submenu for subtopics */}
                                            {currentPath === topic.id && (
                                                <div className="ml-6 border-l-2 border-blue-700 pl-3">
                                                    {topic.subtopics.map(
                                                        subtopic => (
                                                            <NavLink
                                                                key={
                                                                    subtopic.id
                                                                }
                                                                to={`/${topic.id}/${subtopic.id}`}
                                                                className={({
                                                                    isActive
                                                                }) =>
                                                                    `block py-2 px-3 text-sm rounded hover:bg-blue-800 ${
                                                                        isActive
                                                                            ? 'bg-blue-700'
                                                                            : ''
                                                                    }`
                                                                }
                                                            >
                                                                {subtopic.title}
                                                            </NavLink>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </nav>

                                <div className="pt-4 border-t border-blue-800 sticky bottom-0 bg-blue-900 pb-2">
                                    <div className="text-sm text-blue-300">
                                        Teclas de atalho:
                                    </div>
                                    <div className="text-xs text-blue-400 mt-1">
                                        <div>N/P: Próximo/Anterior</div>
                                        <div>F: Flashcards</div>
                                        <div>Q: Quiz</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Main content */}
            <div
                className={`flex-grow overflow-x-hidden ${
                    sidebarOpen && !readingMode ? 'ml-[250px]' : ''
                }`}
                style={{ transition: 'margin-left 0.2s' }}
            >
                {/* Top navigation bar */}
                <header
                    className={`bg-white shadow-sm ${
                        readingMode ? 'py-4 px-8' : 'p-4'
                    } print:hidden`}
                >
                    <div className="flex items-center justify-between">
                        {!readingMode && !sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="mr-4 p-2 rounded-md hover:bg-gray-200"
                            >
                                <FaBars />
                            </button>
                        )}

                        {renderBreadcrumbs()}

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setReadingMode(!readingMode)}
                                className={`p-2 rounded-md ${
                                    readingMode
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'hover:bg-gray-200'
                                }`}
                                title={
                                    readingMode
                                        ? 'Sair do modo leitura'
                                        : 'Modo leitura'
                                }
                            >
                                <IoMdResize />
                            </button>

                            {/* Font size controls could be added here */}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main
                    className={`${
                        readingMode ? 'max-w-3xl mx-auto py-8 px-6' : 'p-6'
                    } print:w-full print:m-0 print:p-0`}
                >
                    {children}
                </main>

                {/* Footer with print info */}
                <footer className="mt-auto py-4 px-6 text-center text-sm text-gray-500 border-t print:hidden">
                    <p>
                        Feito por Luis Abrantes para meu amor, Amanda Marinho
                        Massarioli 💛
                    </p>
                    <p className="hidden print:block mt-2">
                        Impresso em {new Date().toLocaleDateString()}
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;
