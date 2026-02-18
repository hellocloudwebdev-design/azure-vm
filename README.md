# WordPress Post Block Theme (React + Tailwind v4)

This repository contains a reusable **post/news block UI** adapted from the provided React bundle and organized to match common WordPress theme integration patterns.

## Included stack

- React + TypeScript
- Tailwind CSS v4 (theme variables + base layer)
- Vite build tooling

## Integrated component architecture

- `src/App.tsx` is now only a lightweight showcase that renders the reusable component.
- `src/components/news/news-component.tsx` contains the full feature implementation (articles grid, search, bookmarks, modal detail, animation behavior).
- Reusable primitives are in `src/components/ui/`:
  - `card.tsx`
  - `badge.tsx`
  - `button.tsx`
  - `input.tsx`
- Shared utility: `src/lib/utils.ts` (`cn` helper)
- Tailwind theme and CSS variables: `src/index.css`

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## WordPress block-theme integration guide

If your theme does not already use a React build pipeline:

1. Place this app inside your theme (for example `wp-content/themes/<theme>/assets/app`).
2. Build with `npm run build`.
3. Enqueue the compiled CSS/JS from your theme.
4. Add a mount point in a template/block and initialize React on that node.

### Example enqueue snippet

```php
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'news-block-style',
        get_template_directory_uri() . '/assets/app/dist/assets/index.css',
        [],
        null
    );

    wp_enqueue_script(
        'news-block-app',
        get_template_directory_uri() . '/assets/app/dist/assets/index.js',
        [],
        null,
        true
    );
});
```

Then render a mount target like:

```html
<div id="root"></div>
```

## Required dependencies from the supplied bundle

Already declared in `package.json`:

- `framer-motion`
- `lucide-react`
- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `tw-animate-css`
