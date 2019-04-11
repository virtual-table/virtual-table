module CompendiaHelper
  def page_select_options(pages)
    options = []
    pages.each do |page|
      options << ["#{'-' * page.depth} #{page.title}".strip, page.id]
      options += page_select_options(page.children)
    end
    options
  end
end
