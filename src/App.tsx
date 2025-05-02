import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import { GlossaryContextProvider } from './components/Glossary';
import './index.css';

function App() {
    return (
        <Router>
            <GlossaryContextProvider>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/:topicId" element={<TopicPage />} />
                        <Route
                            path="/:topicId/:subtopicId"
                            element={<TopicPage />}
                        />
                    </Routes>
                </MainLayout>
            </GlossaryContextProvider>
        </Router>
    );
}

export default App;
