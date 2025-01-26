import { useState } from "react";
import "./App.css";

const TRENDING_MODELS = [
  { id: "ostris/Flex.1-alpha", name: "Flex.1 Alpha" },
  { id: "black-forest-labs/FLUX.1-dev", name: "FLUX.1 Dev" },
  {
    id: "stabilityai/stable-diffusion-3.5-large",
    name: "Stable Diffusion 3.5 Large",
  },
  { id: "shuttleai/shuttle-jaguar", name: "Shuttle Jaguar" },
  { id: "openfree/pepe", name: "Pepe" },
  { id: "sayakpaul/FLUX.1-dev-edit-v0", name: "FLUX.1 Dev Edit v0" },
  {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    name: "Stable Diffusion XL 1.0",
  },
  { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1 Schnell" },
  {
    id: "strangerzonehf/Flux-Midjourney-Mix2-LoRA",
    name: "Flux Midjourney Mix2 LoRA",
  },
  { id: "XLabs-AI/flux-RealismLora", name: "Flux Realism LoRA" },
  { id: "openfree/claude-monet", name: "Claude Monet" },
  { id: "fofr/sdxl-emoji", name: "SDXL Emoji" },
  { id: "xinsir/controlnet-union-sdxl-1.0", name: "ControlNet Union SDXL 1.0" },
  {
    id: "stable-diffusion-v1-5/stable-diffusion-v1-5",
    name: "Stable Diffusion 1.5",
  },
  {
    id: "strangerzonehf/Flux-Super-Realism-LoRA",
    name: "Flux Super Realism LoRA",
  },
  { id: "openfree/korea-president-yoon", name: "Korea President Yoon" },
  { id: "strangerzonehf/Qd-Sketch", name: "Qd Sketch" },
  {
    id: "seawolf2357/flux-lora-military-artillery-k9",
    name: "Flux LoRA Military Artillery K9",
  },
  { id: "ginipick/flux-lora-eric-cat", name: "Flux LoRA Eric Cat" },
  {
    id: "seawolf2357/flux-lora-car-rolls-royce",
    name: "Flux LoRA Car Rolls Royce",
  },
  { id: "seawolf2357/hanbok", name: "Hanbok" },
  { id: "seawolf2357/ntower", name: "N Tower" },
  {
    id: "stabilityai/stable-diffusion-3.5-medium",
    name: "Stable Diffusion 3.5 Medium",
  },
  { id: "strangerzonehf/Qs-Sketch", name: "Qs Sketch" },
  {
    id: "stabilityai/stable-diffusion-3.5-large-turbo",
    name: "Stable Diffusion 3.5 Large Turbo",
  },
  {
    id: "Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design",
    name: "FLUX.1 Dev LoRA Logo Design",
  },
];

function App() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [format, setFormat] = useState("jpeg");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState(TRENDING_MODELS[0].id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (negativePrompt.length > 500) {
      setError("Negative prompt must be 500 characters or less");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          negativePrompt: negativePrompt || undefined,
          width,
          height,
          format,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = response.json();
        switch (response.status) {
          case 429:
            throw new Error(
              "Too many requests - please wait before trying again"
            );
          case 500:
            throw new Error("Server error - please try again later");
          default:
            throw new Error(errorData.error || "Image generation failed");
        }
      }

      const data = await response.json();
      setImage(`data:${data.mimeType};base64,${data.image}`);
    } catch (err) {
      let message = `${err.message}: `;
      if (err instanceof TypeError) {
        message +=
          "Network error - is the backend available with CORS properly configured?";
      } else if (err instanceof SyntaxError) {
        message += "Invalid server response";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>HuggingFace Image Wizard</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {TRENDING_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter image prompt..."
            required
          />
        </div>

        <div className="input-group">
          <label>
            Negative Prompt:
            <span
              className="tooltip"
              title="Specify what the model should avoid generating"
            >
              ℹ️
            </span>
          </label>
          <textarea
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="Enter negative prompt (optional)"
            maxLength={500}
          />
        </div>

        <div>
          <label>Width:</label>
          <select
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          >
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={768}>768</option>
          </select>

          <label>Height:</label>
          <select
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          >
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={768}>768</option>
          </select>

          <label>Format:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {image && <img src={image} alt="Generated" className="preview-image" />}
    </div>
  );
}

export default App;
