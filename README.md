# IMI AI — Telegram Mini App

Next.js (App Router) + React 19: главный экран, генератор изображений через KIE.ai API, загрузка референсов на сервер, экран результата. Стили — Tailwind CSS 4, анимации — Framer Motion.

## Требования

- Node.js 20+
- Ключ [KIE.ai](https://kie.ai/) для серверного прокси (`KIE_API_KEY`)

## Установка и запуск

```bash
npm install
cp .env.example .env.local
# Заполните KIE_API_KEY и при необходимости UPLOAD_TOKEN_SECRET
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production-сборка
npm run start   # запуск после build
npm run lint    # ESLint (eslint-config-next)
```

## Переменные окружения

См. [.env.example](.env.example). Важно:

- **`KIE_API_KEY`** — вызывается только из Route Handlers (`/api/kie/*`), в браузер не попадает. Если у вас был `NEXT_PUBLIC_KIE_API_KEY`, перенесите значение в `KIE_API_KEY` и удалите старую переменную.
- **`UPLOAD_TOKEN_SECRET`** — подпись одноразовых токенов загрузки; в production задайте явное значение. В `development` без секрета используется фиксированный dev-секрет.

## Архитектура (кратко)

| Область                 | Путь                                                                   |
| ----------------------- | ---------------------------------------------------------------------- |
| Страницы                | `src/app/`                                                             |
| UI                      | `src/components/`                                                      |
| Состояние генерации     | `src/context/GenerationContext.tsx`, `src/hooks/useImageGeneration.ts` |
| Клиент → ваш API        | `src/services/imageService.ts`                                         |
| KIE + upload на сервере | `src/app/api/kie/`, `src/app/api/upload/`                              |

## Next.js

- Включён `images.unoptimized` — удобно для внешних URL результатов и мини-приложений; при переносе на Vercel Image Optimization можно пересмотреть.
- Шрифты Neue Machina / TT Norms подключаются в `src/app/globals.css`; корневой layout не дублирует `next/font` для основного текста.

## Деплой

Сборка: `npm run build`. На [Render](https://render.com/) каталог загрузок использует диск при `RENDER=true` (см. `src/app/api/upload/route.ts` и `src/app/api/uploads/[filename]/route.ts`). Задайте `KIE_API_KEY` и `UPLOAD_TOKEN_SECRET` в настройках сервиса.
