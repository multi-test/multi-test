import ru from 'surveys/Maddi/ru';
import Maddi from 'surveys/Maddi';
import main from './main';
import translations from './common-ru';

main({
    lang: 'ru',
    title: ru.Maddi.name,
    translations: [...translations, ru],
    Survey: Maddi,
    icons: [
        { href: require('surveys/Maddi/assets/maddi-16.png') },
        { size: 144, href: require('surveys/Maddi/assets/maddi-144.png') },
    ],
});
