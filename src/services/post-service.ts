import {IBlog} from "../models/blog-model";
import {IPost} from "../models/post-model";
import {PostsRepository} from "../repositories/posts-repositories";
import {BlogsRepository} from "../repositories/blogs-repositories";
import {RefType} from "mongoose";

export class PostService {

    private postRepository: PostsRepository;
    private blogRepository: BlogsRepository;

    constructor() {
        this.postRepository = new PostsRepository()
        this.blogRepository = new BlogsRepository()
    }

    public async getAll(): Promise<IPost[]> {
        return await this.postRepository.getAllPosts();
    }

    public async create(title: string, shortDescription: string, content: string, blogId: string): Promise<IPost> {
        const blog: IBlog | null = await this.blogRepository.getOneBlog(blogId)
        if (blog) {
            return await this.postRepository.createPost(title, shortDescription, content, (blog?._id).toString(), blog?.name)
        }
        throw new Error()
    }

    public async find(id: RefType): Promise<IPost | undefined> {
        const post = await this.postRepository.getOnePost(id);
        if (!post) throw new Error();

        return post;
    }

    public async getOne(id: RefType): Promise<IPost | undefined> {
        const findPost: IPost | undefined = await this.find(id);
        if (findPost) return findPost;
        throw new Error();
    }

    public async update(id: RefType, title: string, shortDescription: string, content: string, blogId: string): Promise<IPost | undefined> {

        const blog: IBlog | undefined | null = await this.blogRepository.getOneBlog(blogId);
        const updatePost: IPost | undefined | null = await this.postRepository.updatePost(id, title, shortDescription, content, blogId);
        if (blog && updatePost) {
            updatePost.title = title;
            updatePost.shortDescription = shortDescription;
            updatePost.content = content;

            return updatePost;
        }
        throw new Error()
    }

    public async delete(id: string): Promise<IPost> {
        const deletePost = await this.postRepository.deletePost(id)
        if (deletePost) return deletePost
        throw new Error()
    }

    public async testingDelete(): Promise<void> {
        await this.postRepository.deleteAll();
    }
}