class Page::MapPage < ::Page
  
  has_one :map,
    foreign_key: 'page_id'
  
end
