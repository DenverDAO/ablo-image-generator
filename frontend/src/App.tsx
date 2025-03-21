import { Toaster } from 'sonner';
import { ImageGenerator } from './components/ImageGenerator';
import { GeneratedImage } from './components/GeneratedImage';
import { MintDialog } from './components/MintDialog';
import { Web3Provider } from './components/Web3Provider';
import { ConnectWallet } from './components/ConnectWallet';

function App() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              Ablo Image Generator
            </h1>
            <ConnectWallet />
          </header>

          <main className="grid md:grid-cols-2 gap-8">
            <ImageGenerator />
            <GeneratedImage />
          </main>
        </div>
        <MintDialog />
        <Toaster position="top-right" />
      </div>
    </Web3Provider>
  );
}

export default App;
