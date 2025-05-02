import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './index.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="flex gap-8 mb-4">
                <a
                    href="https://vite.dev"
                    target="_blank"
                    className="hover:scale-110 transition-transform"
                >
                    <img
                        src={viteLogo}
                        className="logo h-24 w-24"
                        alt="Vite logo"
                    />
                </a>
                <a
                    href="https://react.dev"
                    target="_blank"
                    className="hover:scale-110 transition-transform"
                >
                    <img
                        src={reactLogo}
                        className="logo react h-24 w-24"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1 className="text-4xl font-bold text-blue-600 mb-6">
                Vite + React + Tailwind
            </h1>
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                <button
                    onClick={() => setCount(count => count + 1)}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors"
                >
                    count is {count}
                </button>
                <p className="text-gray-700 mt-2">
                    Edit{' '}
                    <code className="bg-gray-200 p-1 rounded">src/App.tsx</code>{' '}
                    and save to test HMR
                </p>
            </div>
            <p className="text-green-600 mt-8 font-medium">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
}

export default App;
