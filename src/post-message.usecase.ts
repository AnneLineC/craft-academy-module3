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

export class MessageTooLongError extends Error {}
export class EmptyMessageError extends Error {}

export class PostMessageUseCase {

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  handle(postedMessage: PostedMessage) {
    if (postedMessage.text.length > 280) {
      throw new MessageTooLongError();
    };
    if (postedMessage.text.trim().length === 0) {
      throw new EmptyMessageError();
    }
    this.messageRepository.save({
      id : postedMessage.id,
      text: postedMessage.text,
      author: postedMessage.author,
      publishedAt: this.dateProvider.getNow()
    });
  }
}
