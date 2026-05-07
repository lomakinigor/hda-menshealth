# HDA Design System

Дизайн-образец, извлечённый из лендинга **Академия Развития Человека** (`hda-menshealth.vercel.app`).

Стиль — **wellness-clinical premium-warm**: мягкая тёплая палитра (peach / mint / coral) на cream-фоне, серифные заголовки с курсивными em-акцентами, яркие коралловые CTA. Подходит для проектов: health, lifestyle, wellness, psychology, coaching, retreat-bookings, premium-courses.

---

## Когда использовать этот образец

✅ **Подходит:**
- Health & wellness продукты (клиники, велнесс-центры, ретриты)
- Lifestyle / coaching / psychology
- Premium-курсы, ВИП-программы для взрослых 35+
- Образовательные проекты с человеческим лицом
- Сайты экспертов / частных практик

❌ **Не подходит:**
- B2B SaaS с техно-аудиторией (нужна нейтральная палитра)
- Финтех / банковские продукты (нужен сдержанный business-tone)
- Геймдев, e-sports (нужны контрастные тёмные темы)
- Дашборды / админки

---

## Что есть в системе

```
design-system/
  tokens.css       — CSS-переменные (палитра, шрифты, радиусы, тени, transitions)
  components.css   — типографика, кнопки, карточки, формы, модалки, layout
  README.md        — этот документ
```

---

## Быстрый старт в новом проекте

### 1. Скопировать файлы

Положите `tokens.css` и `components.css` в `assets/` или `styles/` нового проекта.

### 2. Подключить шрифты в `<head>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 3. Подключить CSS

```html
<link rel="stylesheet" href="assets/tokens.css">
<link rel="stylesheet" href="assets/components.css">
```

Порядок важен — `tokens.css` ДО `components.css`.

### 4. Использовать классы

```html
<section>
  <div class="wrap">
    <div class="eyebrow eyebrow--peach">Реальная история</div>
    <h2>От онкологии<br>к <em>осознанной жизни</em></h2>
    <p>Лоркающее описание...</p>
    <a href="#" class="btn btn--primary btn--lg">Забронировать <span class="btn__arrow">→</span></a>
  </div>
</section>
```

---

## Принципы дизайна

### 1. Тёплая пастель + один яркий акцент
Базовый фон `cream` + блоки `peach` / `mint` / `surface` (white). Акцент один — `coral`. Никаких ярких красных, синих, фиолетовых.

### 2. Серифные заголовки, sans-serif интерфейс
Heading'и на **DM Serif Display** — даёт «человечность», «премиальность». Тело и UI — **Plus Jakarta Sans**, чистый geometric sans.

### 3. Курсивный em-акцент в заголовках
В каждом h1 / h2 одно ключевое слово ставится в `<em>`. Курсивный coral — это «дыхание» и эмоциональный пик.

```html
<h1>Сила. Энергия.<br><em>Возрождение.</em></h1>
<h2>От онкологии<br>к <em>осознанной жизни</em></h2>
```

### 4. Eyebrow перед заголовком
Над каждым h2 — pill-метка `.eyebrow` (типа «Реальная история», «Узнаёте себя?», «Инвестиция в себя»). Это микро-навигация и воздух.

### 5. Секции с чередованием фонов
Cream → peach → cream → mint → cream. Чередование тёплых пастельных тонов держит ритм без визуальной усталости.

### 6. Coral как primary CTA
Все «забронировать», «отправить», «купить» — `.btn--primary` (coral filled). Никаких других цветов для главных действий.

### 7. Тонкие радиусы и тени
Радиусы 14–48px (от мелких элементов к большим). Тени **очень мягкие** — не agressive box-shadow, а лёгкая тенью-намёк (`--sh-sm` / `--sh-md`). Создаёт ощущение лёгкости, не «давит».

### 8. Hero — full-screen фото с тёмным контрастом
- `100svh` высота
- Фото через `<img>` с `object-fit: cover`
- Поверх — линейный градиент сверху вниз для читаемости текста (опционально)
- Текст в центре: pre-title (uppercase) + title (serif clamp 3rem→7.5rem) + sub (italic) + CTA
- Внизу — 3 мета-блока (где / когда / свободно)

### 9. Reveal-анимации `.au` → `.au.v`
Через IntersectionObserver навешивается класс `.v`, активирующий fade-up. Задержки `.d1`–`.d5` для последовательной анимации.

### 10. Mobile-first, breakpoints 480 / 600 / 768 / 900
Сначала пишите узкий кейс, потом расширяете через `@media (min-width: ...)`. На `≤480px` — упрощённый layout: одна колонка, padding меньше, кнопки переносятся.

---

## Палитра — по назначению

| Цвет | Назначение |
|------|-----------|
| `--bg` / `--cream` | основной фон страницы |
| `--surface` (white) | карточки, формы, модалки |
| `--peach` | секции боли / эмоций / контраста |
| `--mint` | секции решений / healing / спокойствия |
| `--coral` | **PRIMARY CTA**, акценты в заголовках |
| `--coral-dim` | text-on-light, ошибки |
| `--forest` | dark accent, healing-зелёный |
| `--sun` | yellow-orange highlights, sun-vibe |
| `--text` | основной текст |
| `--muted` | подписи, мелочь |
| `--border` | линии и рамки |

---

## Типографика — иерархия

```
h1 → clamp(2.8rem, 7vw, 5.5rem) — hero title only
h2 → clamp(2.2rem, 5vw, 3.8rem) — section titles
h3 → clamp(1.4rem, 2.5vw, 1.85rem) — sub-headings
body → 1rem (16px), line-height 1.65
small / hints / labels → 0.72rem–0.88rem
```

Все заголовки — `font-family: var(--fd)`, weight 400 (не bold — серифная элегантность).

Body — `--fb` weight 400. Bold — 600/700 для эмфазы.

---

## Компоненты

### Button

```html
<a class="btn btn--primary btn--lg">Текст <span class="btn__arrow">→</span></a>
```

Варианты: `--primary` (coral), `--dark` (text), `--outline` (border), `--white` (light bg). Размеры: дефолт, `--lg`, `--block`.

### Eyebrow

```html
<div class="eyebrow">текст с зелёной точкой</div>
<div class="eyebrow eyebrow--peach">розовый вариант</div>
<div class="eyebrow eyebrow--cream">кремовый с sun-точкой</div>
```

### Card

```html
<div class="card">
  Любой контент. Hover поднимает на 4px.
</div>
```

### Modal

```html
<div class="modal" id="modal">
  <div class="modal__card">
    <!-- содержимое -->
  </div>
</div>
```

JS — добавляет `.open` к `.modal` и `.modal-open` к `body`.

### Form Field

```html
<div class="field">
  <label for="f_name">Имя <span class="req">*</span></label>
  <div class="field__hint">Подсказка переносится по словам</div>
  <input id="f_name" name="name" type="text" placeholder="Иван" required>
</div>
```

### Reveal animation

```html
<div class="au d2">Появится через 200ms когда виден</div>
```

JS:
```js
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); io.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.au').forEach(el => io.observe(el));
```

---

## Tone of Voice (если копируете и копирайт)

- **Личный, прямой** — «Вы», без академизма
- **Эмоциональные курсивные акценты** в заголовках
- **Pre-titles с разделителями** — `· текст · текст ·`
- **Балансируй authority + warmth** — экспертиза без холодности

Пример:
> «Закрытый ВИП-интенсив · 22–31 мая 2026»  
> **Сила. Энергия.** *Возрождение.*  
> Десять дней на лоне Урала с Заслуженным Целителем России.

---

## Адаптация под другой проект

Если ниша **не wellness**, можно:

1. **Заменить акценты** — `--coral` на свой brand color (но оставить тёплый — синий слишком контрастный)
2. **Поменять шрифты** — DM Serif Display → любой serif (Playfair Display, Cormorant), Plus Jakarta Sans → любой sans (Inter, Manrope)
3. **Сменить пастельные фоны** — `--peach` / `--mint` на другие приглушённые pastel (lavender, soft-blue, sand)

Всё остальное (структура секций, типографическая иерархия, паттерны) — переносится без изменений.

---

## Источник

Извлечено из v00 версии лендинга: [v00.html](../v00.html). Архив с историей версий: [versions/](../versions/).

Live: [hda-menshealth.vercel.app](https://hda-menshealth.vercel.app)
