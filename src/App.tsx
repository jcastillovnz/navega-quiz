import { Layout } from './components/layout/Layout';
import { ModuloRipaIalaView } from './components/modules/ModuloRipaIalaView';

function App() {
  return (
    <Layout>
      <div className="flex flex-col items-center gap-16 py-8">
        <ModuloRipaIalaView />
      </div>
    </Layout>
  );
}

export default App;
