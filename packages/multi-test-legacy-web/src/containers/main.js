import translate, { register, change } from 'util/i18n';
import hotMount from 'util/hotMount';
import User from 'surveys/common/User';
import widgets from '../widgets';

export default function main({ title, lang, icons, translations, Survey }) {
    translations.forEach(dic => register(lang, dic));
    (icons || []).forEach(icon => {
      const link = document.createElement('link');
      if (icon.size) {
        link.rel = 'apple-touch-icon-precomposed';
        link.setAttribute('sizes', `${icon.size}x${icon.size}`);
      } else {
        link.rel = 'shortcut icon';
      }
      link.href = icon.href;
      document.head.appendChild(link);
    });

    if (title) {
      document.title = title;
    }

    change(lang);

    hotMount(document.body, undefined, widgets, {
        user: new User(),
        survey: new Survey(),
    });

    let oldWidgets = widgets;

    if (module.hot) {
        module.hot.accept('../widgets', () => {
            const newWidgets = require('../widgets').default;
            hotMount(document.body, oldWidgets, newWidgets);
            oldWidgets = newWidgets;
        });
    }
}
