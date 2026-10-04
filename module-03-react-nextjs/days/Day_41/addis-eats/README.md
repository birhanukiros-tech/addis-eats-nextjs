## Day 41 — SWR Query Key and Cache Decisions

### Menu Query Key

The normal menu uses a query key containing the current page, page size, and category:

`/api/dishes?page=${page}&limit=6&category=${category}`

This makes different pages and categories separate SWR cache entries.

### Search Query Key

When the user enters a search term, the search query key contains:

`/api/dishes?search=${search}&page=${page}&limit=6&category=${category}`

The search term, page number, page size, and category are therefore part of the cache key.

For example, these are different queries:

* `/api/dishes?search=shi&page=1&limit=6`
* `/api/dishes?search=shi&page=2&limit=6`
* `/api/dishes?search=tib&page=1&limit=6`

### Debouncing

The search input uses a 300ms debounce. This prevents a request from being sent for every keystroke.

The request is made only after the user stops typing for approximately 300ms.

### Null Search Key

When there is no search term, the search key is `null`.

This tells SWR not to run the separate search request when the user is simply browsing the normal menu.

### fallbackData

The server already loads the dishes and passes them to the client menu component.

SWR uses this server-rendered data as `fallbackData`, allowing the dishes to appear immediately on the first paint without waiting for the client-side request.

### keepPreviousData

`keepPreviousData: true` keeps the previous results visible while a new search or page is being requested.

This prevents the menu from flashing empty content during a transition such as changing from `shi` to `tib`.

### Cache Deduplication

SWR does not use `staleTime` like TanStack Query.

Instead, this project uses:

`dedupingInterval: 30000`

This prevents duplicate requests for the same SWR key within 30 seconds.

The menu data does not need to be repeatedly requested during a short browsing session.

### Pagination

The API supports `page` and `limit` parameters.

The menu requests six dishes per page and displays Previous/Next controls based on the pagination information returned by the API.

### Polling Order Status

The order-status page uses:

`refreshInterval: 5000`

This causes SWR to check the order API every five seconds.

The order is also passed as `fallbackData`, so the server-rendered order is displayed immediately before client polling begins.
