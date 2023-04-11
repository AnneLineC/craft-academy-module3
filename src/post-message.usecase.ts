export type Message = {
  id: string,
  text:string,
  author: string,
  publishedAt: Date
}

export type PostedMessage = {
  id: string,
  text:string,
  author: string
}

export interface MessageRepository {
  save(message: Message): void;
}

export interface DateProvider {
  getNow(): Date
}

export class PostMessageUseCase {

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  handle(postedMessage: PostedMessage) {
    this.messageRepository.save({
      id : postedMessage.id,
      text: postedMessage.text,
      author: postedMessage.author,
      publishedAt: this.dateProvider.getNow()
    });
  }
}
