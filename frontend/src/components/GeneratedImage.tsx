import { useAppStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function GeneratedImage() {
  const { generatedImage, setGeneratedImage } = useAppStore();

  if (!generatedImage) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generated Image</CardTitle>
        <CardDescription>
          Your AI-generated image is ready. You can download it or generate a
          new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={generatedImage}
            alt="Generated"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => window.open(generatedImage, '_blank')}
          >
            Download
          </Button>
          <Button variant="outline" onClick={() => setGeneratedImage(null)}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
