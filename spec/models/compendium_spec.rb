require 'rails_helper'

RSpec.describe Compendium, type: :model do
  describe 'relations' do
    it { is_expected.to belong_to(:author).class_name 'User' }
    it { is_expected.to have_many(:pages).dependent(:destroy).order(position: :asc) }
    it { is_expected.to have_many(:maps).dependent(:destroy) }
    it { is_expected.to have_many(:games).through(:game_compendiums) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:title) }
  end
end
