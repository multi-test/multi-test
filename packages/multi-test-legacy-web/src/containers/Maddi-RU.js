import ru from 'surveys/Maddi/ru';
import Maddi from 'surveys/Maddi';
import main from './main';
import translations from './common-ru';

main({
    lang: 'ru',
    translations: [...translations, ru],
    Survey: Maddi,
});
