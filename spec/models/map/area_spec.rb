require 'rails_helper'

RSpec.describe Map::Area, type: :model do
  subject(:area) { build :map_area }

  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }

  describe 'relations' do
    it { is_expected.to belong_to(:floor)                      }
    it { is_expected.to have_many(:area_pages)                 }
    it { is_expected.to have_many(:pages).through(:area_pages) }
  end

  describe 'validations' do
    it { is_expected.to allow_value('[[0,0], [5, 0], [5, 5], [0, 5]]').for(:bounds_json) }
    it { is_expected.to_not allow_value('this is not json').for(:bounds_json)            }
  end
end
