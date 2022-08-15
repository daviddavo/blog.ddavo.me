---
title: How to create a "Work in progress" banner for your website
date: 2022-08-15T22:38:38+02:00
author: David Davó
tags:
  - tutorial
  - web design
lastmod: 2022-08-15T21:00:40.657Z
---

My personal website is currently made in Symfony. Yeah, I know, not the best thing for this purpose, but I started it a few years ago, when I was younger and carelessler...

A few days ago, I decided I wanted to refactor my website and create a whole new one, using a static site generator. Ended up deciding on Hugo, btw.

As the old one was a bit, well, clunky, I wanted the new one to be online ASAP as possible. But I needed a banner that said "hey, I'm still working on it, be careful". Well, I don't really needed it, but it's cool nevertheless.

My objective was to emulate a kind of "caution" tape, the yellow and black one that reminds you of roadworks. Making a stripes background wasn't difficult, thanks to tools like [stripesgenerator.com](https://stripesgenerator.com/), but the most important thing of all is adding a little tilt, simulating the falling tape.

This could be accomplished thanks to the [`transform: rotate()`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate) CSS property.

It ended up being something like this:

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="bGvQdxo" data-user="daviddavo" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/daviddavo/pen/bGvQdxo">
  Untitled</a> by David Davó (<a href="https://codepen.io/daviddavo">@daviddavo</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

What do you think? Pretty neat, huh? If you have any comments on it, share your modifications!.
