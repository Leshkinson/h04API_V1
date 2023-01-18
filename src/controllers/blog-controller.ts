import {Request, Response} from "express";
import {IBlog} from "../models/blog-model";
import {BlogService} from "../services/blog-service";

export class BlogController {
    static async getAllBlogs(req: Request, res: Response) {
        try {
            const blogService = new BlogService();
            const blogs: IBlog[] = await blogService.getAll();
            res.status(200).json(blogs);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    static async createBlog(req: Request, res: Response) {
        try {
            const {name, description, websiteUrl} = req.body;
            const blogService = new BlogService();
            const newBlogs: IBlog = await blogService.create(name, description, websiteUrl);
            res.status(201).json(newBlogs);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    static async getOneBlog(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const blogService = new BlogService();
            const findBlog: IBlog | undefined = await blogService.getOne(id);
            if (findBlog) res.status(200).json(findBlog);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async updateBlog(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {name, description, websiteUrl} = req.body;
            const blogService = new BlogService();
            const updateBlog: IBlog | undefined = await blogService.update(id, name, description, websiteUrl);
            if (updateBlog) res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async deleteBlog(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const blogService = new BlogService();
            await blogService.delete(id);
            res.sendStatus(204);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
}