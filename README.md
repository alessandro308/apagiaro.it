# apagiaro.it

Source of [apagiaro.it](https://apagiaro.it), my personal site and blog, where I write about engineering, AI agents, MCP and the occasional side project.

It's a [Jekyll](https://jekyllrb.com/) site. It started as a fork of the [Moon](https://github.com/TaylanTatli/Moon) theme, but has since been redesigned with a dark theme and a set of custom components for blog posts.

## Deployment

The site is served by **GitHub Pages** from the `master` branch, using the custom domain in `CNAME`. Pushing to `master` publishes the site.

GitHub Pages builds the site with its own Jekyll version and plugin set, so the `Gemfile` only matters for the local preview.

## Local preview

The preview runs in Docker:

```sh
./test.sh              # serves on http://localhost:4567
PORT=4000 ./test.sh    # use a different host port
```

`test.sh` builds the image from `Dockerfile` and starts `jekyll serve` with `_config.yml,_config_dev.yml`. The dev config empties `site.url`, so CSS and JS load from the local server instead of production.

The image copies the repo at build time, so you need to re-run `test.sh` to see changes. For live reload, mount the repo instead:

```sh
docker run -d -p 4567:8080 -v "$PWD":/app --name test-site my-jekyll-site \
  bundle exec jekyll serve --host 0.0.0.0 --port 8080 --config _config.yml,_config_dev.yml
```

Stop it with `docker rm -f test-site`.

## Writing a post

Posts live in `_posts/` and are named `YYYY-MM-DD-slug.md`. The permalink is `/:title/`, so the post is published at `https://apagiaro.it/slug/`.

```yaml
---
layout: post
title: "Your MCP Is a Frontend. Test It Like One."
date: 2026-05-19
excerpt: "One or two sentences with the thesis. Used on the post list and in social previews."
tag:
- MCP
- AI
comments: true        # Disqus comments
# feature: image.jpg  # optional feature image
# showFeature: true   # show it at the top of the post
---
```

### Prose components

Posts can use a set of editorial building blocks, defined in `_includes/prose/`. They are CSS only, styled in `_sass/_prose-components.scss`.

| Component | Use it for | Example |
| --- | --- | --- |
| `lede` | Big opening statement with an optional kicker | `{% include prose/lede.html eyebrow="..." text="..." %}` |
| `callout` | Highlighted box. `tone="machine"` (teal, default) or `tone="human"` (amber) | `{% include prose/callout.html label="..." text="..." tone="human" %}` |
| `split` | Two contrasting sides with a labelled divider | `{% include prose/split.html left_label="..." left="..." right_label="..." right="..." divider="..." %}` |
| `steps` | Numbered list | `{% include prose/steps.html items="Bold lead\|rest;;Bold lead\|rest" %}` |
| `grid` | Two-column card grid | `{% include prose/grid.html items="Title\|Body;;Title\|Body" %}` |

`steps` and `grid` items are written as `Title|Body` and separated by `;;`. Text can contain HTML, and in `lede` you can wrap words in `<span class='prose-lede__machine'>` or `<span class='prose-lede__human'>` to accent them. Use single quotes inside the parameters, because the parameters themselves are wrapped in double quotes.

## Repository layout

| Path | What's there |
| --- | --- |
| `_posts/` | Blog posts |
| `_layouts/`, `_includes/`, `_sass/` | Theme: page templates, partials and styles |
| `_data/navigation.yml` | Navigation menu links |
| `about/`, `posts/`, `projects/`, `tags/` | Site pages |
| `assets/` | CSS, JS, fonts, images and downloadable files linked from posts |
| `_config.yml` | Site config: title, bio, social links, plugins |
| `_config_dev.yml` | Local preview overrides |
| `BLE-slides/`, `revealjs/`, `chord/`, `cobra-app/`, `cryptomarket/`, `mesh/`, `ripetitoreWifiDIY/`, `t/`, `video/` | Standalone pages, slides and demos from older posts and projects, served as they are |

## License

MIT, inherited from the Moon theme. See [LICENSE](LICENSE).
