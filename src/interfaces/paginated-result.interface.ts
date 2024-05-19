export interface PaginatedResult {
  data: any[] //data_type (npr. users)
  meta: {
    total: number //num. pages
    page: number //current page
    last_page: number
  }
}
