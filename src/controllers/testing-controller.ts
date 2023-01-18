import {Request, Response} from "express";
import {BlogService} from "../services/blog-service";
import {PostService} from "../services/post-service";

export class TestController {
    static async testing(req: Request, res: Response): Promise<void> {
        try {
            const blogService = new BlogService();
            const postService = new PostService();
            await blogService.testingDelete();
            await postService.testingDelete();
            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
}