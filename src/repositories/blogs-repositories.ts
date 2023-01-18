import {Model, RefType} from "mongoose";
import {BlogModel, IBlog} from "../models/blog-model";

export class BlogsRepository {
    private blogModel: Model<IBlog>;

    constructor() {
        this.blogModel = BlogModel;
    }

    public async getAllBlogs() {
        return this.blogModel.find();
    }

    public async createBlog(name: string, description: string, websiteUrl: string): Promise<IBlog> {
        return await this.blogModel.create({name, description, websiteUrl})
    }

    public async getOneBlog(id: RefType) {
        return this.blogModel.findById({_id:id});
    }

    public async updateBlog(id: RefType, name: string, description: string, websiteUrl: string) {
        return this.blogModel.findOneAndUpdate({_id:id}, {
            name,
            description,
            websiteUrl
        })
    }

    public async deleteBlog(id: RefType) {
        return this.blogModel.findOneAndDelete({_id:id})
    }

    public async deleteAll() {
        return this.blogModel.deleteMany()
    }
}