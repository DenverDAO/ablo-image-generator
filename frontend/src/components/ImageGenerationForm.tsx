import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  prompt: z.string().min(1, 'Please enter a prompt'),
  style: z.string().min(1, 'Please select a style'),
});

type FormValues = z.infer<typeof formSchema>;

const styles = [
  'photographic',
  'digital-art',
  'anime',
  'cartoon',
  '3d-render',
  'pixel-art',
];

export function ImageGenerationForm() {
  const { isGenerating, setGenerating, setGeneratedImage } = useAppStore();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      style: 'photographic',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setError(null);
      setGenerating(true);

      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await response.json();
      setGeneratedImage(result.imageUrl);
      toast.success('Image generated successfully!');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to generate image');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  list="styles"
                  placeholder="Select or type a style..."
                  {...field}
                />
              </FormControl>
              <datalist id="styles">
                {styles.map((style) => (
                  <option key={style} value={style} />
                ))}
              </datalist>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm font-medium text-destructive">{error}</div>
        )}

        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </Button>
      </form>
    </Form>
  );
}
