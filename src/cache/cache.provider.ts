import Cache from "./cache";

enum CacheType {
  AddressCache,
  TokenCache,
}

class CacheProvider {
  private static _cacheList: Map<CacheType, Cache<any, any>> = new Map();

  private constructor() {}

  public static getCache(type: CacheType) {
    switch (type) {
      case CacheType.AddressCache: {
        return CacheProvider.getInstance<string, string>(
          CacheType.AddressCache
        );
      }

      case CacheType.TokenCache: {
        return CacheProvider.getInstance<string, string>(CacheType.TokenCache);
      }
    }
  }

  private static getInstance<K, V>(type: CacheType): Cache<K, V> {
    let cache;
    if (!this._cacheList.has(type)) {
      cache = new Cache<K, V>();
      this._cacheList.set(type, cache);
    } else {
      cache = this._cacheList.get(type);
    }

    return cache;
  }
}

export { CacheType, CacheProvider };
