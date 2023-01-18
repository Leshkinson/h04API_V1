import {Model, RefType} from "mongoose";
import {PostModel, IPost} from "../models/post-model";

export class PostsRepository {
    private postModel: Model<IPost>

    constructor() {
        this.postModel = PostModel
    }

    public async getAllPosts() {
        return this.postModel.find()
    }

    public async createPost(title: string, shortDescription: string, content: string, blogId: string | undefined, blogName: string | undefined) {
        return await this.postModel.create({title, shortDescription, content, blogId, blogName})
    }

    public async getOnePost(id: RefType) {
        return this.postModel.findById({_id:id})
    }

    public async updatePost(id: RefType, title: string, shortDescription: string, content: string, blogId: string) {
        return this.postModel.findOneAndUpdate({_id:id}, {
            title,
            shortDescription,
            content,
            blogId
        })
    }

    public async deletePost(id: RefType) {
        return this.postModel.findOneAndDelete({_id:id})
    }

    public async deleteAll() {
        return this.postModel.deleteMany()
    }
}