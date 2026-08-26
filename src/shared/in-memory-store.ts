export class InMemoryStore<T extends { id: string }> {
	private readonly store = new Map<string, T>();

	public set(item: T): void {
		this.store.set(item.id, item);
	}

	public get(id: string): T | undefined {
		return this.store.get(id);
	}

	public delete(id: string): boolean {
		return this.store.delete(id);
	}

	public findAll(): T[] {
		return [...this.store.values()];
	}

	public findBy(predicate: (item: T) => boolean): T[] {
		return this.findAll().filter(predicate);
	}

	public deleteBy(predicate: (item: T) => boolean): void {
		for (const [id, item] of this.store) {
			if (predicate(item)) {
				this.store.delete(id);
			}
		}
	}
}
