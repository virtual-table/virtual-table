require 'rails_helper'

RSpec.describe Map::Background, type: :model do
  subject(:background) { build :map_background }

  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }

  describe 'relations' do
    it { is_expected.to belong_to(:floor) }
  end
end
