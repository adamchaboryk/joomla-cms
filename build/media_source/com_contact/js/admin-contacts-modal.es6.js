/**
 * @copyright  (C) 2018 Open Source Matters, Inc. <https://www.joomla.org>
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */
(() => {
  'use strict';

  // Use a JoomlaExpectingPostMessage flag to be able to distinct legacy methods
  if (window.parent.JoomlaExpectingPostMessage) {
    return;
  }

  /**
    * Javascript to insert the link
    * View element calls jSelectContact when a contact is clicked
    * jSelectContact creates the link tag, sends it to the editor,
    * and closes the select frame.
    */

  window.jSelectContact = (id, title, catid, object, link, lang) => {
    // eslint-disable-next-line no-console
    console.warn('Method jSelectContact() is deprecated. Use postMessage() instead.');

    let hreflang = '';

    if (!Joomla.getOptions('xtd-contacts')) {
      return false;
    }

    const { editor } = Joomla.getOptions('xtd-contacts');

    if (lang !== '') {
      hreflang = `hreflang = "${lang}"`;
    }

    const tag = `<a ${hreflang}  href="${link}">${title}</a>`;
    window.parent.Joomla.editors.instances[editor].replaceSelection(tag);

    if (window.parent.Joomla.Modal && window.parent.Joomla.Modal.getCurrent()) {
      window.parent.Joomla.Modal.getCurrent().close();
    }
    return true;
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Get the elements
    const elements = document.querySelectorAll('.select-link');

    for (let i = 0, l = elements.length; l > i; i += 1) {
      // Listen for click event
      elements[i].addEventListener('click', (event) => {
        event.preventDefault();
        const functionName = event.target.getAttribute('data-function');

        if (functionName === 'jSelectContact' && window[functionName]) {
          // Used in xtd_contacts
          window[functionName](event.target.getAttribute('data-id'), event.target.getAttribute('data-title'), null, null, event.target.getAttribute('data-uri'), event.target.getAttribute('data-language'), null);
        } else if (window.parent[functionName]) {
          // Used in com_menus
          window.parent[functionName](event.target.getAttribute('data-id'), event.target.getAttribute('data-title'), null, null, event.target.getAttribute('data-uri'), event.target.getAttribute('data-language'), null);
        }

        if (window.parent.Joomla.Modal && window.parent.Joomla.Modal.getCurrent()) {
          window.parent.Joomla.Modal.getCurrent().close();
        }
      });
    }
  });
})();
