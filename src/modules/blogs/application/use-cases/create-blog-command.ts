import { CreateBlogDto } from "../../api/input-Dtos/create-Blog-Dto-Model";


export class CreateBlogCommand {
  constructor(public readonly blogInputModel: CreateBlogDto) {
  }

}

