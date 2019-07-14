require 'rails_helper'

RSpec.describe PageContent, type: :model do
  subject(:page_content) { build :page_text_content }
  
  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }
  
  describe '.available_content_types' do
    it 'includes Content::Image' do
      expect(PageContent.available_content_types).to include Content::Image
    end
    
    it 'includes Content::Text' do
      expect(PageContent.available_content_types).to include Content::Text
    end
  end
  
  describe '#build_content' do
    it 'builds a Content::Image if content_type is set to "Content::Image"' do
      page_content.content_type = 'Content::Image'
      content = page_content.build_content
      expect(content).to be_a Content::Image
    end
    
    it 'builds a Content::Text if content_type is set to "Content::Text"' do
      page_content.content_type = 'Content::Text'
      content = page_content.build_content
      expect(content).to be_a Content::Text
    end
  end
end
