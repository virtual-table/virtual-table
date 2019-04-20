import Quill from 'quill/core'

// Monkey-patch icons by using inline SVG:
import BrokenIcons from 'quill/ui/icons'
import FixedIcons  from 'lib/quill/ui/icons'
for (let [key, value] of Object.entries(FixedIcons)) {
  BrokenIcons[key] = value
}

// MonkeyPatch Picker#buildLabel() so we can use inline dropdown SVG:
import DropdownIcon from '!!raw-loader!quill/assets/icons/dropdown.svg'
import BrokenPicker from 'quill/ui/picker'
BrokenPicker.prototype.buildLabel = function() {
  let label = document.createElement('span');
  label.classList.add('ql-picker-label');
  label.innerHTML = DropdownIcon;
  label.tabIndex = '0';
  label.setAttribute('role', 'button');
  label.setAttribute('aria-expanded', 'false');
  this.container.appendChild(label);
  return label;
}

import Toolbar from 'quill/modules/toolbar'
import Snow    from 'quill/themes/snow'

import Bold   from 'quill/formats/bold'
import Italic from 'quill/formats/italic'
import Header from 'quill/formats/header'

Quill.register({
  'modules/toolbar': Toolbar,
  'themes/snow':     Snow,
  'formats/bold':    Bold,
  'formats/italic':  Italic,
  'formats/header':  Header
})

export default Quill
