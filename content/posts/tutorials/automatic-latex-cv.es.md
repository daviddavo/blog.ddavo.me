---
title: Compilando LaTeX bilingüe y publicándolo con GitHub pages
date: 2022-09-01T19:14:22.496Z
author: David Davó
tags:
  - tutorial
  - LaTeX
  - GitHub actions
lastmod: 2022-09-01T19:15:51.706Z
categories:
  - tutorial
---

Hace tiempo que quería poner mi currículum en la página web, pero para ello
debía asegurarme de que estaba SIEMPRE actualizado. Es decir, que se compilaba y
publicaba automáticamente cada vez que realizase cambios en el fichero fuente.

Desde hace ya más de 5 años, mi currículum está escrito en LaTeX, usando (y modificando) la
plantilla [Awesome CV](https://github.com/posquit0/Awesome-CV). Además, le añadí
un par de cosas para hacerlo "bilingüe" y poder compilar o bien al inglés o al castellano,
haciendo que el documento esté disponible en múltiples idiomas.

Gracias a `iflang`, dependiendo de la opción que le pasemos al importar el paquete `babel`, se renderizará
el documento en un idioma u otro.

```latex
\documentclass[a4paper]{awesome-cv}
\usepackage[<lang>]{babel}
\usepackage{iflang}

\newcommand{\es}[1]{\IfLanguageName{spanish}{#1}{}}
\newcommand{\en}[1]{\IfLanguageName{english}{#1}{}}

\begin{document}
  \es{¡Hola Mundo!}
  \en{Hello World!}
\end{document}
```

Sin embargo, es necesario cambiar `<lang>` a mano, por lo que no puede ser automatizado. Una opción sencilla sería usar `sed` para modificar el fichero, pero puede no estar instalado en el sistema (si usas Windows) y me apetecía usar algo LaTeX puro.

Juan Carlos Fabero me dio la idea de usar un par de ficheros 
envoltorio (_wrappers_) que simplemente definan la variable y e importen el contenido de `main.tex`. En cuanto al fichero principal, solo sería necesario añadir un par de líneas para comprobar si dicha variable está definida o no.

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

De esta manera, si compilamos `english.tex` se generará un documento en Inglés, y si compilamos `spanish.tex` se creará en castellano.

## Automatizando con GitHub pages

No nos podemos olvidar de hacer que todo esto se haga de manera automática, sin tocar nada. Para ello, el CV está
en un [proyecto de GitHub](https://github.com/daviddavo/22CV), y cada vez que se hace un _commit_, se compila el fichero y se aloja usando GitHub pages. Así, queda el CV accesible desde _github.io_:

- Inglés: https://daviddavo.github.io/22CV/David_Davo_CV_English.pdf
- Castellano: https://daviddavo.github.io/22CV/David_Davo_CV_Spanish.pdf

El _workflow_ es bastante sencillo, lo creé directamente desde la página web modificando un poco el por defecto para que compile el PDF usando [latex-action](https://github.com/marketplace/actions/github-action-for-latex), y lo suba a GitHub pages. Ya de paso comprueba que 
el PDF generado no tiene más de 2 páginas (un folio por las dos caras).

```yaml
name: CI

# Controls when the workflow will run
on:
  # Triggers the workflow on push or pull request events but only for the "main" branch
  push:
    branches: [ "main" ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      - uses: actions/checkout@v3
      - name: Build LaTeX
        uses: xu-cheng/latex-action@v2
        with:
          latexmk_use_xelatex: true
          # Compile multiple documents
          root_file: |
            english.tex
            spanish.tex
      - name: Assert built files are 2 pages long
        run: |
          sudo apt-get install -y poppler-utils
          [ $(pdfinfo english.pdf | awk '/^Pages:/ {print $2}') -le 2 ]
          [ $(pdfinfo spanish.pdf | awk '/^Pages:/ {print $2}') -le 2 ]
      - name: Build Github page
        run: |
          mv english.pdf _site/David_Davo_CV_English.pdf
          mv spanish.pdf _site/David_Davo_CV_Spanish.pdf
      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v1.0.3
  deploy:
    needs: build
    
    # Grant GITHUB_TOKEN the permissions required to make a Pages deployment
    permissions:
      pages: write      # to deploy to Pages
      id-token: write   # to verify the deployment originates from an appropriate source

    # Deploy to the github-pages environment
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    # Specify runner + deployment step
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
        with:
          artifact-name: build
```

El toque final está en una pequeña página html por si alguien entra en la raíz del GitHub pages ([daviddavo.github.io/22CV](https://daviddavo.github.io/22CV)),
que simplemente redirige a mi página web personal.
