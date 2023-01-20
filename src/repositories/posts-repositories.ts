import {Model, RefType, SortOrder} from "mongoose";
import {PostModel, IPost} from "../models/post-model";

export class PostsRepository {
    private postModel: Model<IPost>;

    constructor() {
        this.postModel = PostModel;
    }

    public async getAllPosts(pageNumber: number = 1, pageSize: number = 10, sortBy: string = 'createdAt', sortDirection: SortOrder = 'desc'): Promise<IPost[]> {
        const skip: number = (+pageNumber - 1) * +pageSize;

        return this.postModel.find().sort([[`${sortBy}`, sortDirection]]).skip(skip).limit(+pageSize);
    }

    public async createPost(title: string, shortDescription: string, content: string, blogId: string | undefined, blogName: string | undefined): Promise<IPost> {
        return await this.postModel.create({title, shortDescription, content, blogId, blogName});
    }

    public async getOnePost(id: RefType): Promise<IPost | null> {
        return this.postModel.findById({_id: id});
    }

    public async updatePost(id: RefType, title: string, shortDescription: string, content: string, blogId: string): Promise<IPost | null> {
        return this.postModel.findOneAndUpdate({_id: id}, {
            title,
            shortDescription,
            content,
            blogId
        })
    }

    public async deletePost(id: RefType) {
        return this.postModel.findOneAndDelete({_id: id});
    }

    public async deleteAll() {
        return this.postModel.deleteMany();
    }
}