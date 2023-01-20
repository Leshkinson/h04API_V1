import {SortOrder} from "mongoose";
import {Request, Response} from "express";
import {IBlog} from "../models/blog-model";
import {IPost} from "../models/post-model";
import {BlogService} from "../services/blog-service";
import {QueryService} from "../services/query-service";

export class BlogController {
    static async getAllBlogs(req: Request, res: Response) {
        try {
            let {pageNumber, pageSize} = req.query;
            const searchNameTerm = req.query.sortDirection as string;
            const sortDirection = req.query.sortDirection as SortOrder;
            const sortBy = req.query.sortBy as string;
            const blogService = new BlogService();
            const blogs: IBlog[] = await blogService.getAll(searchNameTerm, +pageNumber, +pageSize, sortBy, sortDirection);
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

    static async getAllPostsForTheBlog(req: Request, res: Response) {
        try {
            const {blogId} = req.params;
            let {pageNumber, pageSize} = req.query;
            const sortDirection = req.query.sortDirection as SortOrder;
            const sortBy = req.query.sortBy as string;
            if (blogId && pageNumber && pageSize && sortDirection && sortBy) {
                const queryService = new QueryService();
                const posts: IPost[] = await queryService.getPostsForTheBlog(blogId, +pageNumber, +pageSize, sortBy, sortDirection);
                const result = {
                    "pagesCount": await queryService.getCountPages(blogId, +pageSize),
                    "page": +pageNumber,
                    "pageSize": +pageSize,
                    "totalCount": (posts.length),
                    "items": posts
                };
                if (result) res.status(200).json(result)
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    static async createPostTheBlog(req: Request, res: Response) {
        try {
            const {blogId} = req.params;
            const {title, shortDescription, content} = req.body;
            const queryService = new QueryService();
            const newPost: IPost | undefined = await queryService.createPostForTheBlog(blogId, title, shortDescription, content);
            if (newPost) res.status(201).json(newPost);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
}