import {
  registerDecorator, ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { BlogsQueryRepositories } from "../modules/blogs/infrastructure/query-repository/blogs-query.repositories";

export function IsMongoIdObject(validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: "IsMongoIdObject",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: BlogIdValidator
      //validator: { validate(value: any) {return ObjectId.isValid(value)}}
    });
  };
}


@ValidatorConstraint({ name: "IsMongoIdObject", async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly blogsQueryRepositories: BlogsQueryRepositories) {
  }

  async validate(blogId: string) {
    try {
      const blog = await this.blogsQueryRepositories.findBlog(blogId);
      if (!blog) return false;
      return true;
    } catch (e) {
      return false;
    }
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return "Blog doesn't exist"
  }

}