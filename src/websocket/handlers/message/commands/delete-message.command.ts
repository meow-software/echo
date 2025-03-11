import { DeleteMessageDto } from "@tellme/shared";

export class DeleteMessageCommand {
    constructor(public messageDto : DeleteMessageDto) { }
}
