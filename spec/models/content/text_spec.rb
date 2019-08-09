require 'rails_helper'

RSpec.describe Content::Text, type: :model do
  subject(:text) { build :content_text }

  it { is_expected.to be_valid       }
  it { is_expected.to be_persistable }

  describe 'relations' do
    it { is_expected.to have_one(:page_content)                }
    it { is_expected.to have_one(:page).through(:page_content) }
  end
end
