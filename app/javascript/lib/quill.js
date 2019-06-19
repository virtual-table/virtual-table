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
import Bubble  from 'quill/themes/bubble'

import Blockquote         from 'quill/formats/blockquote'
import Bold               from 'quill/formats/bold'
import Code               from 'quill/formats/code'
import Header             from 'quill/formats/header'
import Link               from 'quill/formats/link'
import List, { ListItem } from 'quill/formats/list'
import Italic             from 'quill/formats/italic'
import Underline          from 'quill/formats/underline'

Quill.register({
  'modules/toolbar':    Toolbar,
  'themes/bubble':      Bubble,
  'formats/blockquote': Blockquote,
  'formats/bold':       Bold,
  'formats/code':       Code,
  'formats/italic':     Italic,
  'formats/link':       Link,
  'formats/list':       List,
  'formats/list-item':  ListItem,
  'formats/header':     Header,
  'formats/underline':  Underline
})

export default Quill
