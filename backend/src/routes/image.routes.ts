import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { validateImageRequest } from "../middlewares/validation.middleware";

const router = Router();
const imageController = new ImageController();

router.post(
  "/generate",
  validateImageRequest,
  imageController.generateImage.bind(imageController)
);

export default router;
