import { CreatePostDto } from "../../api/input-Dtos/create-Post-Dto-Model";


export class CreatePostCommand {
  constructor(public readonly postInputModel: CreatePostDto,
              public readonly blogName: string) {
  }

}

