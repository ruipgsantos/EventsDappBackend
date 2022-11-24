import { Type } from "typescript";

export default class Cache<K, V> {
  protected _storage: Map<K, V>;

  public constructor() {
    this._storage = new Map<K, V>();
  }

  public set(key: K, value: V): void {
    this._storage.set(key, value);
  }

  public get(key: K): V {
    return this._storage.get(key);
  }

  public remove(key: K): boolean {
    return this._storage.delete(key);
  }
}
