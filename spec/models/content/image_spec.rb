require 'rails_helper'

RSpec.describe Content::Image, type: :model do
  subject(:image) { build :content_image }

  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }

  describe 'relations' do
    it { is_expected.to have_one(:page_content)                }
    it { is_expected.to have_one(:page).through(:page_content) }
  end

  describe 'Bugfix: ActiveStorage issue where image is only updated when ANOTHER field is also updated' do
    context 'when updating random_number' do
      before { image.random_number = 42 }

      it 'sets updated_at to change' do
        expect(image.changes).to include 'updated_at'
      end
    end
  end
end
