import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Timeline from '../components/Timeline';
import Glossary from '../components/Glossary';
import topicsData from '../data/topics.json';

const HomePage = () => {
  const navigate = useNavigate();
  const { topics } = topicsData;

  const handlePeriodSelect = (topicId: string) => {
    navigate(`/${topicId}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          História - Preparação para Recuperação
        </h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <p className="text-blue-700">
            Bem-vindo ao portal de estudos para a prova de recuperação de História! 
            Este site contém materiais para ajudar você a entender os tópicos: 
            <span className="font-medium"> Napoleão, Liberalismo, Revoluções Liberais e Socialismos</span>.
          </p>
        </div>

        {/* Timeline component */}
        <Timeline onPeriodSelect={handlePeriodSelect} />

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Topics overview */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tópicos de Estudo</h2>
            <div className="space-y-4">
              {topics.map(topic => (
                <motion.div 
                  key={topic.id}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg cursor-pointer"
                  whileHover={{ x: 5 }}
                  onClick={() => navigate(`/${topic.id}`)}
                >
                  <h3 className="text-lg font-medium text-blue-700">{topic.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Período: {topic.period}</p>
                  <p className="text-gray-700">{topic.summary}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Study tips */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dicas de Estudo</h2>
            <div className="bg-white rounded-lg shadow-md p-5">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-2 mt-0.5">1</span>
                  <div>
                    <h4 className="font-medium">Use a Linha do Tempo</h4>
                    <p className="text-gray-600 text-sm">Compreenda a sequência dos eventos e suas relações.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-2 mt-0.5">2</span>
                  <div>
                    <h4 className="font-medium">Pratique com Flashcards</h4>
                    <p className="text-gray-600 text-sm">Teste seu conhecimento com os cartões de memória em cada tópico.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-2 mt-0.5">3</span>
                  <div>
                    <h4 className="font-medium">Faça os Quizzes</h4>
                    <p className="text-gray-600 text-sm">Verifique seu aprendizado com questões de múltipla escolha.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-2 mt-0.5">4</span>
                  <div>
                    <h4 className="font-medium">Consulte o Glossário</h4>
                    <p className="text-gray-600 text-sm">Passe o mouse sobre termos destacados para ver suas definições.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-bold mr-2 mt-0.5">5</span>
                  <div>
                    <h4 className="font-medium">Use o Modo Leitura</h4>
                    <p className="text-gray-600 text-sm">Ative o modo leitura para eliminar distrações durante o estudo.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-6 p-3 bg-yellow-50 border-l-3 border-yellow-400 text-sm text-yellow-800">
                <strong>Lembre-se:</strong> Use as teclas de atalho (N/P, F, Q) para navegar e abrir ferramentas de estudo.
              </div>
            </div>
          </div>
        </div>

        {/* Glossary */}
        <Glossary />
      </motion.div>
    </div>
  );
};

export default HomePage;
