GULP-PROJECT
=========================

#####   Что это такое?
gulp-project - это базовый шаблон проекта для верстки.

#####   Как работает?
 1. Установите все необходимые зависимости `npm install`.
 2. Используйте один из скриптов `npm run dev` или `npm run build`.

#####   Подробнее о скриптах
`npm run dev` используется непосредственно для разработки. Скрипт включает отслеживание файлов проекта и автоматическое обновление страницы при изменении файлов стилей или разметки.

`npm run build` запускает сборку проекта:
- Компиляция SASS/SCSS
 - Минификация CSS
 - Автоматическое добавление вендорных префиксов
 - Объединение медиа-запросов
 - Оптимизация изображений