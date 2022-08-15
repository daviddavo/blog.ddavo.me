---
title: Como crear un banner de "Sitio en construcción"
date: 2022-08-15T22:38:38+02:00
author: David Davó
tags:
  - tutorial
  - web design
lastmod: 2022-08-15T21:08:03.127Z
---

Mi página personal está hecha en Symfony. Ya, ya sé, no es la mejor elección, pero empecé cuando era joven y más descuidado, pensando que iba a haber más dinamismo, haría muchas cosas, y una página web compilada no sería suficiente.

Hace un par de días decidí que ya era hora de empezar de cero y crear una página nueva, esta vez usando un generador estático. Acabé decidiéndome por [Hugo](https://gohugo.io).

Como la página antigua era un poco... malurria, quería sacar la nueva lo antes posible. Sin embargo, aún me faltaba un banner que dijese "eh, aún estoy trabajando en ello y seguro que faltan cosas". Bueno, en realidad no es completamente necesario, pero queda chulo.

Mi objetivo era emular una especie de cinta de peligro, de estas negras y amarillas que te recuerdan a las obras. Hacer el fondo de rayas no fue difícil, gracias a herramientas como [stripesgenerator.com](https://stripesgenerator.com/), pero lo más importante es girar un poquito el componente, simulando una cinta mal colocada y cediendo ante la gravedad.

No fue tan difícil, gracias a la propiedad [`transform: rotate()`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate).

Al final quedó algo así:

<p class="codepen" data-height="300" data-default-tab="css,result" data-slug-hash="bGvQdxo" data-user="daviddavo" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/daviddavo/pen/bGvQdxo">
  Untitled</a> by David Davó (<a href="https://codepen.io/daviddavo">@daviddavo</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

¿Qué opinas? Ha quedado chulo, ¿no? Si haces alguna modificación, ¡no te olvides de compartirla!
