import { DateProvider, EmptyMessageError, Message, MessageRepository, MessageTooLongError, PostedMessage, PostMessageUseCase } from "../post-message.usecase";

describe("Feature: Posting a message", () => {

  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  })

  describe("Rule: A message can contain a maximum of 280 characters", () => {
    test("Alice can post a message on her timeline", () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "Hello World",
        author: "Alice"
      });

      fixture.thenPostedMessageShouldBe({
        id: "message-id",
        text: 'Hello World',
        author: 'Alice',
        publishedAt: new Date('2023-01-19T19:00:00.000Z')
      })
    });

    test("Alice cannot post a message with more than 280 characters", () => {
      const textWithLengthOf355 = "Et fugiat incididunt qui nulla proident exercitation reprehenderit voluptate minim. Incididunt ad tempor minim laboris nisi dolor est ullamco quis commodo consequat non in. Anim exercitation duis ipsum mollit mollit velit consequat id magna ea consectetur in sunt aliquip. Quis fugiat eiusmod nisi duis reprehenderit minim incididunt laborum exercitation."

      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: textWithLengthOf355,
        author: "Alice"
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message cannot be empty", () => {
    test("Alice cannot post an empty message", () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "",
        author: "Alice"
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    })

    test("Alice cannot post a message with only whitespaces", () => {
      fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'));

      fixture.whenUserPostsAMessage({
        id: "message-id",
        text: "    ",
        author: "Alice"
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    })
  })
});

class InMemoryMessageRepository implements MessageRepository {
  message: Message
  save(msg: Message): void {
    this.message = msg
  }
}

class StubDateProvider implements DateProvider {
  now: Date;
  getNow(): Date {
    return this.now;
  }
}



const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();
  const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
  );
  let thrownError: Error;
  return {
    givenNowIs(_now: Date) {
      dateProvider.now = _now;
    },
    whenUserPostsAMessage(postedMessage: PostedMessage) {
      try {
        postMessageUseCase.handle(postedMessage)
      } catch (err) {
        thrownError = err;
      }
    },
    thenPostedMessageShouldBe(expectedMessage: Message) {
      expect(expectedMessage).toEqual(messageRepository.message)
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    }
  }
}

type Fixture = ReturnType<typeof createFixture>
