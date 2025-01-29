export HUGGINGFACE_ACCESS_TOKEN=your_huggingface_access_token_here
docker build -t hf-text-to-image . && docker run -d --name my-image-wizard -p 7860:7860 -e PROD=false -e HUGGINGFACE_ACCESS_TOKEN=$HUGGINGFACE_ACCESS_TOKEN hf-text-to-image
open http://localhost:7860