import { Layout } from './components/layout/Layout';
import { ImageGenerationForm } from './components/ImageGenerationForm';
import { GeneratedImage } from './components/GeneratedImage';
import { MintDialog } from './components/MintDialog';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Layout>
        <div className="container py-8 space-y-8">
          <div className="max-w-2xl mx-auto">
            <ImageGenerationForm />
          </div>
          <GeneratedImage />
        </div>
      </Layout>
      <MintDialog />
      <Toaster />
    </>
  );
}

export default App;
