import ru from 'surveys/Amon/ru';
import Amon from 'surveys/Amon';
import main from './main';
import translations from './common-ru';

main({
    lang: 'ru',
    translations: [...translations, ru],
    Survey: Amon,
    title: ru.Amon.name,
});
