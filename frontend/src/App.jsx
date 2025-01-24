import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [format, setFormat] = useState('png');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          width,
          height,
          format
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Image generation failed');
      }

      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Flux Image Wizard</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter image prompt..."
            required
          />
        </div>
        
        <div>
          <label>Width:</label>
          <select value={width} onChange={(e) => setWidth(Number(e.target.value))}>
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={768}>768</option>
          </select>

          <label>Height:</label>
          <select value={height} onChange={(e) => setHeight(Number(e.target.value))}>
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={768}>768</option>
          </select>

          <label>Format:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {image && <img src={image} alt="Generated" className="preview-image" />}
    </div>
  );
}

export default App
