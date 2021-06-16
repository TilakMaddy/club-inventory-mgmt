import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything

    read(existing = [], { args, cache }) {
      // first thing appolo does it asks read function for those items
      // we wither supply it from cache or return false

      // args -> skip, first
      const { skip, first } = args;

      // read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY })

      const count = data?._allProductsMeta.count;
      const page = skip / first + 1
      const pages = Math.ceil(count/first);

      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If
      // There are items
      // AND there aren't enough items to satisfy how many were requested
      // AND we are on the last page
      // THEN JUST SEND IT

      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if(items.length !== first) {
        // we dont have any items , we must go back to the network and fetch
        return false;
      }

      if(items.length) {
        return items;
      }

      return false;

    },

    // comeback from network with new items
    merge(existing, incoming, { args }) {

      const { skip, first } = args;

      // this runs when read() returns false and apollo comes back from
      // the network request - feshly queried Keystone js database

      const merged = existing ? existing.slice(0) : [];

      for(let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      return merged
    }
  }
}