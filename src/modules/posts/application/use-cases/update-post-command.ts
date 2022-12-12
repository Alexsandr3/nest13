import { CreatePostDto } from "../../api/input-Dtos/create-Post-Dto-Model";


export class UpdatePostCommand {
  constructor(public readonly id: string,
              public readonly postInputModel: CreatePostDto) {
  }

}

