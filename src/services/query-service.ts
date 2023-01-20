import {IBlog} from "../models/blog-model";
import {IPost, PostModel} from "../models/post-model";
import mongoose, {Model, RefType, SortOrder} from "mongoose";
import {BlogsRepository} from "../repositories/blogs-repositories";

export class QueryService {
    private blogRepository: BlogsRepository;
    private postModel: Model<IPost>;

    constructor() {
        this.blogRepository = new BlogsRepository();
        this.postModel = PostModel;
    }

    public async findBlog(blogId: RefType): Promise<IBlog | undefined> {
        const blog = await this.blogRepository.getOneBlog(blogId);
        if (!blog) throw new Error();

        return blog;
    }

    public async getCountPages(blogId: RefType, pageSize: number = 10) {
        const blog = await this.findBlog(blogId);
        const countDocument = await this.postModel.find({blogId: (blog?._id)?.toString()}).count();

        return Math.ceil(countDocument/+pageSize);
    }

    public async createPostForTheBlog(blogId: RefType, title: string, shortDescription: string, content: string ): Promise<IPost> {
        const blog: IBlog | null = await this.blogRepository.getOneBlog(blogId);
        if (blog) {
            const blogId = new mongoose.Types.ObjectId((blog?._id).toString());
            return await this.postModel.create({title, shortDescription, content, blogId, blogName: blog?.name});
        }
        throw new Error();
    }

    public async getPostsForTheBlog (blogId: RefType, pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'createdAt', sortDirection: SortOrder = 'desc') {
        const blog = await this.findBlog(blogId);
        const skip: number = (+pageNumber - 1) * +pageSize;
        if (blog) {
            return this.postModel.find({blogId: (blog?._id)?.toString()}).sort([[`${sortBy}`, sortDirection]]).skip(skip).limit(+pageSize);
        }
        throw new Error();
    }
}