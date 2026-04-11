\### Claude Prompt: Pixel-Perfect AI Image Generator (TMA)



\*\*Role:\*\* Senior React/TS Developer.

\*\*Task:\*\* Build a Telegram Mini App for image generation via Nanobanana2 API.



\#### 1. Analysis (MCP Required)

\*   \*\*Figma \[1:1]:\*\* https://www.figma.com/design/DKQchrKh0E46jYjP7OVCgl/Test-TG-%7C-IMI--Copy-. Match colors, spacing, radius, and shadows perfectly.

\*   \*\*Fonts:\*\* Integrate \*\*Neue Machina\*\* (Headers) \& \*\*TT Norms\*\* (Body) via `@font-face` and Tailwind config (source directory: fonts/...).

\*   \*\*API:\*\* \[Nanobanana2 Docs]. Key: `e206caa8d107a3c6281057fcba171564`. 

\*   \*\*Locale:\*\* All UI in \*\*Russian\*\*.



\#### 2. Screen 1: Home (UI Only)

\*   \*\*Header:\*\* Logo "IMI" + "AI" badge.

\*   \*\*Center:\*\* Heading "Чем я могу помочь Вам сегодня?".

\*   \*\*Input:\*\* Placeholder "Спросите что-нибудь" + Button "GPT-5.2" inside.

\*   \*\*Agents:\*\* Horizontal scroll: "СамоГПТ", "Код-Ассистент", "Дизайнер" (placeholders).

\*   \*\*Footer:\*\* Large button "Сгенерировать изображение" (Only functional element).

\*   \*\*Tags:\*\* Labels below button: Banana Pro, Flux, Midjourney, GPT Image, Seedream, Ideogram.



\#### 3. Screen 2: Generator (Functional)

\*   \*\*Header:\*\* Title "Создание изображений" + Functional Back button.

\*   \*\*Upload:\*\* "Загрузить изображение" (converts to Base64).

\*   \*\*Prompt:\*\* Textarea "Напишите что хотите создать".

\*   \*\*Model:\*\* Select dropdown (Default: "Nano Banana Pro").

\*   \*\*Templates:\*\* Horizontal scroll with clickable cards (e.g., "Роскошный портрет", "В небоскрёбе среди цветов") + "Показать все". Clicking auto-fills the prompt.

\*   \*\*Aspect Ratio:\*\* Toggle buttons (16:9, 1:1, 9:16).

\*   \*\*Action:\*\* Custom Blue button "Создать фото • ◎ 2".



\#### 4. UX \& Tech

\*   \*\*Transitions:\*\* Snappy `framer-motion` (200ms) and button scale-down feedback.

\*   \*\*States:\*\* Use Figma-style Skeletons for loading. Show result image with "Back" option.

\*   \*\*Telegram SDK:\*\* Call `expand()`, handle native `BackButton` for navigation.

\*   \*\*Security:\*\* Use `.env` for key, validate uploads (<5MB, JPEG/PNG), sanitize inputs.

\*   \*\*Architecture:\*\* Clean modular code (`/components`, `/hooks`, `/services`, `/types`).

