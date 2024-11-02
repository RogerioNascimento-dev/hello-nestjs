import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionBastAnswerChosenEvent } from './events/question-bast-answer-chosen-event'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'

export interface QuestionProps {
  authorId: UniqueEntityID
  bastAnswerId?: UniqueEntityID | null
  title: string
  slug: Slug
  attachments: QuestionAttachmentList
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ): Question {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    )
    return question
  }

  get authorId() {
    return this.props.authorId
  }

  get bastAnswerId() {
    return this.props.bastAnswerId
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'day') <= 3
  }

  set bastAnswerId(bastAnswerId: UniqueEntityID | undefined | null) {
    if (bastAnswerId === undefined || bastAnswerId === null) {
      return
    }
    if (
      this.props.bastAnswerId === undefined ||
      this.props.bastAnswerId === null ||
      !this.props.bastAnswerId.equals(bastAnswerId)
    ) {
      this.addDomainEvent(new QuestionBastAnswerChosenEvent(this, bastAnswerId))
    }

    this.props.bastAnswerId = bastAnswerId
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
