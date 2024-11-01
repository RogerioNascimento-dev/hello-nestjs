import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const customAggregate = new CustomAggregate(null)
    customAggregate.addDomainEvent(new CustomAggregateCreated(customAggregate))
    return customAggregate
  }
}

describe('DomainEvents', () => {
  it('shuld be able to dispatch and listen events', () => {
    // function to verify if the callback was called
    const callbackSpy = vi.fn()

    // subscribe the callback to listen to the event
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // create the aggregate
    const customAggregate = CustomAggregate.create()
    expect(customAggregate.domainEvents).toHaveLength(1)

    // dispatch the events
    DomainEvents.dispatchEventsForAggregate(customAggregate.id)

    // verify if the callback was called
    expect(callbackSpy).toHaveBeenCalled()
    expect(customAggregate.domainEvents).toHaveLength(0)
  })
})
