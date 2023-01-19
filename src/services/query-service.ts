import {Model, RefType, SortOrder} from "mongoose";
import {IBlog} from "../models/blog-model";
import {BlogsRepository} from "../repositories/blogs-repositories";
//import {PostsRepository} from "../repositories/posts-repositories";
import {IPost, PostModel} from "../models/post-model";

export class QueryService {
    private blogRepository: BlogsRepository;
    private postModel: Model<IPost>;
    constructor() {
        this.blogRepository = new BlogsRepository()
        this.postModel = PostModel;
    }

    public async findBlog(blogId: RefType): Promise<IBlog | undefined> {
        const blog = await this.blogRepository.getOneBlog(blogId);
        if (!blog) throw new Error();

        return blog;
    }

    public async getAllPostsForTheBlog (blogId: RefType, pageNumber: number, pageSize: number, sortBy: string, sortDirection: SortOrder) {
        const blog = await this.findBlog(blogId)
        console.log('Blog', blog)
        return this.postModel.find({blogId: (blog?._id)?.toString()}).limit(+pageSize)
            // .sort({createdAt: -1}).skip(1).limit(+pageSize)
    }
}