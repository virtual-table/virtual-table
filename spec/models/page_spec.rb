# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Page, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:title) }
  end

  describe 'relations' do
    it { is_expected.to belong_to(:compendium) }
    it { is_expected.to belong_to(:parent).class_name('Page').optional }
    it do
      is_expected.to have_many(:children).class_name('Page')
                                         .dependent(:destroy)
    end

    it do
      is_expected.to have_many(:contents).class_name('PageContent')
        .inverse_of(:page)
        .autosave(true)
                                         .dependent(:destroy)
    end
  end

  context 'default position on create' do
    let(:page) { build :page }
    subject { page.send :set_default_position }

    context 'with a parent' do
      let(:parent_page) { build :page_with_children }
      before { page.parent = parent_page }

      it { is_expected.to eq 5 }
    end

    context 'without a parent, with a compendium' do
      let(:compendium_with_pages) { build :compendium_with_pages }
      before { page.compendium = compendium_with_pages }

      it { is_expected.to eq 4 }
    end

    context 'without a parent or compendium' do
      it { is_expected.to be 1 }
    end
  end

  describe '.without_parent' do
    let!(:page_with_children) { create :page_with_children }
    let!(:page_without_children) { create :page }
    subject { Page.without_parent }

    it 'returns those pages without a parent' do
      expect(subject).to contain_exactly(page_with_children, page_without_children)
    end
  end

  describe '#depth' do
    context 'with a parent' do
      it 'returns the depth of the parent + 1'
    end

    context 'without a parent' do
      it 'returns 0'
    end
  end
end
