import {BlogModel, IBlog} from "../models/blog-model";
import {IPost, PostModel} from "../models/post-model";
import mongoose, {Model, RefType, SortOrder} from "mongoose";
import {BlogsRepository} from "../repositories/blogs-repositories";
import {PostsRepository} from "../repositories/posts-repositories";

export class QueryService {
    private blogRepository: BlogsRepository;
    private postRepository: PostsRepository;
    private postModel: Model<IPost>;
    private blogModel: Model<IBlog>;

    constructor() {
        this.blogRepository = new BlogsRepository();
        this.postRepository = new PostsRepository();
        this.postModel = PostModel;
        this.blogModel = BlogModel;
    }

    public async findBlog(blogId: RefType): Promise<IBlog | undefined> {
        const blog = await this.blogRepository.getOneBlog(blogId);
        if (!blog) throw new Error();

        return blog;
    }

    public async getTotalCountForBlogs(searchNameTerm: { name: { $regex: RegExp } } | {} = {}) {
        return this.blogModel.find(searchNameTerm).count();
    }

    public async getTotalCountForPosts() {
        return this.postModel.find().count();
    }

    public async getCountPagesForBlogs(pageSize: number) {
        const countDocument = await this.getTotalCountForBlogs();

        return Math.ceil(countDocument / +pageSize);
    }

    public async getCountPagesForPosts(pageSize: number) {
        const countDocument = await this.getTotalCountForPosts();

        return Math.ceil(countDocument / +pageSize);
    }

    public async getTotalCountPostsForTheBlog(blogId: RefType) {
        const blog = await this.findBlog(blogId);

        return this.postModel.find({blogId: (blog?._id)?.toString()}).count();
    }

    public async getPagesCountPostsForTheBlog(blogId: RefType, pageSize: number) {
        const countDocument = await this.getTotalCountPostsForTheBlog(blogId);

        return Math.ceil(countDocument / +pageSize);
    }

    public async createPostForTheBlog(blogId: RefType, title: string, shortDescription: string, content: string): Promise<IPost> {
        const blog = await this.findBlog(blogId);
        if (blog) {
            const blogId = new mongoose.Types.ObjectId((blog?._id).toString());
            return await this.postModel.create({title, shortDescription, content, blogId, blogName: blog?.name});
        }
        throw new Error();
    }

    public async getPostsForTheBlog(blogId: RefType, pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'createdAt', sortDirection: SortOrder = 'desc') {
        const blog = await this.findBlog(blogId);
        const skip: number = (+pageNumber - 1) * +pageSize;
        if (blog) {
            return this.postModel.find({blogId: (blog?._id)?.toString()}).sort({[sortBy]: sortDirection}).skip(skip).limit(+pageSize);
        }
        throw new Error();
    }
}