---
title: Compilando LaTeX en múltiples idiomas y publicándolo con GitHub pages
date: 2022-08-23T18:10:57.978Z
author: David Davó
tags:
  - tutorial
  - LaTeX
  - GitHub actions
lastmod: 2022-08-25T05:18:27.484Z
draft: true
---

Hace tiempo que quería poner mi currículum en la página web, pero para ello
debía asegurarme de que estaba SIEMPRE actualizado. Es decir, que se compilaba y
publicaba automáticamente cada vez que realizase cambios.

Desde hace ya más de 5 años, mi currículum está escrito en LaTeX, usando (y modificando) la
plantilla [Awesome CV](https://github.com/posquit0/Awesome-CV). Además, le añadí
un par de cosas para hacerlo "bilingüe" y poder compilar o bien al inglés o al castellano.

Dependiendo de la opción que le pasemos al importar el paquete `babel`, se renderizará
el documento en un idioma u otro.

```latex
\documetnclass[a4paper]{awesome-cv}
\usepackage[<lang>]{babel}
\usepackage{iflang}

\newcommand{\es}[1]{\IfLanguageName{spanish}{#1}{}}
\newcommand{\en}[1]{\IfLanguageName{english}{#1}{}}

\begin{document}
  \es{¡Hola Mundo!}
  \en{Hello World!}
\end{document}
```

Sin embargo, es necesario cambiar `<lang>` a mano, por lo que no puede ser automatizado. Una opción sencilla sería usar `sed` para modificar el fichero, pero me apetecía usar algo LaTeX puro.

Juan Carlos Fabero me dio la idea de usar un par de ficheros 
envoltorios que simplemente definan la variable y ejecuten el contenido de `main.tex`.

### Modificación `main.tex`
```latex
% Usamos la variable si está definida
\ifdefined\babellang
    \usepackage[\babellang]{babel}
% Si no, usamos el por defecto (o cambiado manualmente desde el IDE)
\else
    \usepackage[english]{babel}
\fi
```

### Fichero `english.tex`
```latex
\def\babellang{english}
\input{main.tex}
```

### Fichero `spanish.tex`
```latex
\def\babellang{spanish}
\input{main.tex}
```

// TODO: Explicar el nuevo workflow con github actions directo
