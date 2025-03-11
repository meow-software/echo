import { UpdateMessageDto } from "@tellme/shared";

export class UpdateMessageCommand {
    constructor(public messageDto : UpdateMessageDto) { }
}
