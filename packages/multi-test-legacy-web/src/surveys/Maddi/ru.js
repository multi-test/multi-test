/* eslint max-len: 0 */

import { linebreak } from 'util/softbreak';

export default {
    Maddi: {
        name: 'Тест жизнестойкости (Мадди, Леонтьев, Рассказова)',
        description: linebreak(
          'Ответьте, пожалуйста, на несколько вопросов о себе.\n' +
          'Выбирайте тот ответ, который наилучшим образом отражает ваше мнение.\n' +
          'Здесь нет правильных или неправильных ответов, так как важно только ваше мнение.\n' +
          'Просьба работать в темпе, подолгу не задумываясь над ответами.'
        ),
        questions: {
          1: "Я часто не уверен в собственных решениях.",
          2: "Иногда мне кажется, что никому нет до меня дела.",
          3: "Часто, даже хорошо выспавшись, я с трудом заставляю себя встать с постели.",
          4: "Я постоянно занят, и мне это нравится.",
          5: "Часто я предпочитаю «плыть по течению».",
          6: "Я меняю свои планы в зависимости от обстоятельств.",
          7: "Меня раздражают события, из-за которых я вынужден менять свой распорядок дня.",
          8: "Непредвиденные трудности порой сильно утомляют меня.  ",
          9: "Я всегда контролирую ситуацию настолько, насколько это необходимо.",
          10: "Порой я так устаю, что уже ничто не может заинтересовать меня.",
          11: "Порой все, что я делаю, кажется мне бесполезным.",
          12: "Я стараюсь быть в курсе всего происходящего вокруг меня.",
          13: "Лучше синица в руках, чем журавль в небе.",
          14: "Вечером я часто чувствую себя совершенно разбитым.",
          15: "Я предпочитаю ставить перед собой труднодостижимые цели и добиваться их.",
          16: "Иногда меня пугают мысли о будущем.",
          17: "Я всегда уверен, что смогу воплотить в жизнь то, что задумал.",
          18: "Мне кажется, я не живу полной жизнью, а только играю роль.",
          19: "Мне кажется, если бы в прошлом у меня было меньше разочарований и невзгод, мне было бы сейчас легче жить на свете.",
          20: "Возникающие проблемы часто кажутся мне неразрешимыми.",
          21: "Испытав поражение, я буду пытаться взять реванш.",
          22: "Я люблю знакомиться с новыми людьми.",
          23: "Когда кто-нибудь жалуется, что жизнь скучна, это значит, что он просто не умеет видеть интересное.",
          24: "Мне всегда есть чем заняться.",
          25: "Я всегда могу повлиять на результат того, что происходит вокруг.",
          26: "Я часто сожалею о том, что уже сделано.",
          27: "Если проблема требует больших усилий, я предпочитаю отложить ее до лучше их времен.",
          28: "Мне трудно сближаться с другими людьми.",
          29: "Как правило, окружающие слушают меня внимательно.",
          30: "Если бы я мог, я многое изменил бы в прошлом.",
          31: "Я довольно часто откладываю на завтра то, что трудно осуществимо, или то, в чем я не уверен.",
          32: "Мне кажется, жизнь проходит мимо меня.",
          33: "Мои мечты редко сбываются.",
          34: "Неожиданности дарят мне интерес к жизни.",
          35: "Порой мне кажется, что все мои усилия тщетны.",
          36: "Порой я мечтаю о спокойной размеренной жизни.",
          37: "Мне не хватает упорства закончить начатое.",
          38: "Бывает, жизнь кажется мне скучной и бесцветной.",
          39: "У меня нет возможности влиять на неожиданные проблемы.",
          40: "Окружающие меня недооценивают.",
          41: "Как правило, я работаю с удовольствием.",
          42: "Иногда я чувствую себя лишним даже в кругу друзей.",
          43: "Бывает, на меня наваливается столько проблем, что просто руки опускаются.",
          44: "Друзья уважают меня за упорство и непреклонность.",
          45: "Я охотно берусь воплощать новые идеи."
        },
        answers: {
          0: 'нет',
          1: 'скорее нет, чем да',
          2: 'скорее да, чем нет',
          3: 'да',
        },
        scales: {
          commitment: 'Вовлеченность',
          control: 'Контроль',
          challenge: 'Принятие риска',
          hardiness: 'Жизнестойкость',
        },
    },
};