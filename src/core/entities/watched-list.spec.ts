import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}
describe('Watched List', async () => {
  it('should be able to create a watched list items', async () => {
    const list = new NumberWatchedList([1, 2, 3])
    expect(list.currentItems).toHaveLength(3)
  })
  it('should be able to add new item to watched list', async () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.add(4)
    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toHaveLength(1)
    expect(list.getNewItems()).toEqual([4])
  })
  it('should be able to remove items from watched list', async () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.remove(3)
    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([3])
  })

  it('shuld be able to add an item even if it was removed before', async () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.remove(2)
    list.add(2)
    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('shuld be able to remove an item even if it was added before', async () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.add(4)
    list.remove(4)
    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })
  it('shuld be able to updated watched list items', async () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.update([1, 3, 5])

    expect(list.currentItems).toHaveLength(3)
    expect(list.getNewItems()).toEqual([5])
    expect(list.getRemovedItems()).toEqual([2])
  })
})
