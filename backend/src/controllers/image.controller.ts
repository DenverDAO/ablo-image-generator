import { Request, Response, NextFunction } from "express";
import { ImageService } from "../services/image.service";
import { formatResponse } from "../utils/response";

export class ImageController {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  async generateImage(req: Request, res: Response, next: NextFunction) {
    try {
      const options = req.body;
      const imageBuffer = await this.imageService.generateImage(options);

      res.type("image/png"); // Adjust based on requested format
      res.send(imageBuffer);
    } catch (error) {
      next(error);
    }
  }
}
