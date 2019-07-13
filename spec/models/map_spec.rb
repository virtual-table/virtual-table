require 'rails_helper'

RSpec.describe Map, type: :model do
  subject(:map) { build :map }
  
  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }
  
  describe 'callbacks' do
    context 'on create' do
      it 'creates a connected Page::MapPage' do
        expect { map.save }.to change { Page::MapPage.count }.by +1
        
        page = Page::MapPage.last
        
        expect(page.map).to eql map
        expect(page.compendium).to eql map.compendium
      end
    end
    
    context 'on update' do
      subject(:map) { create :map }
      
      it 'updates the connected Page title' do
        page = map.page
        
        new_title = map.title.reverse
        map.update! title: new_title
        
        expect(page.title).to eql new_title
      end
    end
  end
  
  describe '#width' do
    it 'returns the max width of its floors' do
      map.floors.build columns: 10
      map.floors.build columns: 5
      
      expect(map.width).to eql 500
    end
  end
  
  describe '#height' do
    it 'returns the max height of its floors' do
      map.floors.build rows: 10
      map.floors.build rows: 5
      
      expect(map.height).to eql 500
    end
  end
end
