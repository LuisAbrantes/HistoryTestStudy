import { useEffect, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

interface ExcalidrawMindMapProps {
  topicId: string;
}

const ExcalidrawMindMap = ({ topicId }: ExcalidrawMindMapProps) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [resetKey, setResetKey] = useState(0);
  
  // We could load a template relevant to the current topic
  useEffect(() => {
    if (excalidrawAPI) {
      // This would be a place to load topic-specific templates
      // For now we'll just set some initial elements
      
      // Clear canvas first
      excalidrawAPI.resetScene();
      
      // Add central node based on topic
      let topicTitle = '';
      switch (topicId) {
        case 'napoleao':
          topicTitle = 'Napoleão Bonaparte';
          break;
        case 'liberalismo':
          topicTitle = 'Liberalismo';
          break;
        case 'revolucoes-liberais':
          topicTitle = 'Revoluções Liberais';
          break;
        case 'socialismos':
          topicTitle = 'Socialismos';
          break;
        default:
          topicTitle = 'História';
      }
      
      // Add a central element
      excalidrawAPI.updateScene({
        elements: [
          {
            type: "rectangle",
            x: window.innerWidth / 2 - 100,
            y: window.innerHeight / 2 - 50,
            width: 200,
            height: 50,
            backgroundColor: "#4a90e2",
            strokeColor: "#1e68e0",
            fillStyle: "solid",
            strokeWidth: 1,
            roundness: {
              type: 2,
              value: 10,
            },
            id: "central-node",
            text: topicTitle,
            fontSize: 20,
            fontFamily: 1,
            textAlign: "center",
            verticalAlign: "middle",
          }
        ]
      });
    }
  }, [excalidrawAPI, topicId]);
  
  const handleReset = () => {
    if (excalidrawAPI) {
      excalidrawAPI.resetScene();
      setResetKey(prev => prev + 1);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Mapa Mental</h3>
        <button 
          onClick={handleReset}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Limpar Quadro
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <Excalidraw
          key={resetKey}
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={{
            appState: {
              viewBackgroundColor: "#f8f9fa"
            }
          }}
          gridModeEnabled={false}
          zenModeEnabled={false}
          theme="light"
          name={`${topicId}-mindmap`}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p className="mb-1">Dicas:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Arraste para criar conexões entre conceitos</li>
          <li>Use cores diferentes para categorizar ideias</li>
          <li>Clique duas vezes em um elemento para editar o texto</li>
          <li>Use o botão "Limpar Quadro" para recomeçar</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcalidrawMindMap;
