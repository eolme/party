import context from '../utils/context';
import { APP_SUPPORT } from '../utils/constants';

if ('console' in context) {
  try {
    if ('clear' in context.console) {
      context.console.clear();
    }
  } catch { /* ignore */ }

  const FONT_FAMILY = 'font-family:Montserrat,"Avenir Black",Verdana,"Century Gothic","Arial Black",monospace,monospace';

  const WARN_TEMPLATE = '%c%s';
  const WARN_STYLE = `font-size:20px;font-weight:600;${FONT_FAMILY}`;
  const WARN_MESSAGE = `Эта функция браузера предназначена для разработчиков. Если кто-то сказал вам скопировать и вставить что-то здесь, чтобы включить функцию приложения или «взломать» чей-то аккаунт, это мошенники. Выполнив эти действия, вы предоставите им доступ к своему аккаунту.`;

  const LOGO_TEMPLATE = `%cGAME`;
  const LOGO_STYLE = `color:#000;font-size:50px;font-weight:800;${FONT_FAMILY}`;

  const SUPPORT_TEMPLATE = `%c%s %o`;
  const SUPPORT_STYLE = `color:#43A047;font-weight:600;${FONT_FAMILY}`;
  const SUPPORT_MESSAGE = 'Тех. поддержка:';

  try {
    console.log(LOGO_TEMPLATE, LOGO_STYLE);
    console.log(WARN_TEMPLATE, WARN_STYLE, WARN_MESSAGE);
    console.log(SUPPORT_TEMPLATE, SUPPORT_STYLE, SUPPORT_MESSAGE, APP_SUPPORT);
  } catch { /* ignore */ }
}
