import { LoaderContent, LoaderPage } from './Loaders.js';
import MenuNav from './MenuNav.js';
import FileUpload from './FileUpload.js';
import ButtonUp from './ButtonUp.js';
import FooterPersonality from './Footer.js';
import { ButtonShowColumn, CheckboxContainer } from './ShowColumn.js';

customElements.define(LoaderPage.nameElement, LoaderPage);
customElements.define(LoaderContent.nameElement, LoaderContent);
customElements.define(MenuNav.nameElement, MenuNav, { extends: 'nav' });
customElements.define(FileUpload.nameElement, FileUpload);
customElements.define(ButtonUp.nameElement, ButtonUp);
customElements.define(FooterPersonality.nameElement, FooterPersonality, { extends: 'footer' });
customElements.define(ButtonShowColumn.nameElement, ButtonShowColumn, { extends: 'button' });
customElements.define(CheckboxContainer.nameElement, CheckboxContainer);
