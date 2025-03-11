import { CreateMessageDto } from "@tellme/shared";

export class CreateMessageCommand {
    constructor(public messageDto : CreateMessageDto) { }
}
