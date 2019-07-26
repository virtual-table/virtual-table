require 'rails_helper'

RSpec.describe Content::Image, type: :model do
  let(:image) { Content::Image.new }

  context 'fix ActiveStorage issue where image is only updated when ANOTHER field is also updated' do
    context 'when updating random_number' do
      before { image.random_number = 42 }

      it 'sets updated_at to change' do
        expect(image.changes).to include 'updated_at'
      end
    end
  end
end
