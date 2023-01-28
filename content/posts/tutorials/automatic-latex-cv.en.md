---
title: Compiling and publishing multilingual LaTeX with GitHub
date: 2022-09-01T19:14:22.496Z
author: David Davó
tags:
  - tutorial
  - LaTeX
  - GitHub actions
lastmod: 2022-09-04T10:35:26.103Z
categories:
  - tutorial
---

I have been wanting to publish my CV in my personal site for quite some time, but first I needed
to make sure that it was always up-to-date. I.e. that it was compiled and published automatically
every time I made some changes to the source file.

Since 5 years ago, my CV is written using LaTeX, using (and modifying) the [Awesome CV](https://github.com/posquit0/Awesome-CV) template. On top of that, I added a few things to make it bilingual, compiling
either in Spanish or English, making the document available in multiple languages.

Thanks to `iflang`, depending on the option you pass to the `babel` package, the document will be rendered in Spanish or English.

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

Nevertheless, we need to change `<lang>` by hand, it can't be automated. A simple option to automate it
would be to use `sed` to modify that file, but it may not be installed in the system (Windows...), and I wanted a pure LaTeX solution.

Juan Carlos Fabero gave me the idea of using a couple of _wrappers_ that define a variable and import
the contents of `main.tex`. We'd have to add a couple of lines to the main file to take that
variable into account, checking if it's been defined.

### Modifying `main.tex`
```latex
% Usamos la variable si está definida
\ifdefined\babellang
    \usepackage[\babellang]{babel}
% Si no, usamos el por defecto (o cambiado manualmente desde el IDE)
\else
    \usepackage[english]{babel}
\fi
```

### File `english.tex`
```latex
\def\babellang{english}
\input{main.tex}
```

### File `spanish.tex`
```latex
\def\babellang{spanish}
\input{main.tex}
```

This way, if we compile `english.tex`, we will get an English document, and if we compile `spanish.tex` we'll get the Spanish one.

## Automation with GitHub pages

We can't forget about doing all this automatically. The source files are located in a [GitHub project](https://github.com/daviddavo/22CV), and every time a new commit is pushed, the files are compiled and published using GitHub pages. Both files are available through _github.io_:

- English: https://daviddavo.github.io/22CV/David_Davo_CV_English.pdf
- Spanish: https://daviddavo.github.io/22CV/David_Davo_CV_Spanish.pdf

The workflow used is very simple, I created it just using the web interface, adding a build action that uses [latex-action](https://github.com/marketplace/actions/github-action-for-latex) to compile the document, and then a publish action to upload the generated files to GitHub pages. Furthermore, I added an assert to check
that the files are only two pages long.

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

The final touch is a small raw HTML page that redirects to my personal webpage, in the event someone
goes into the root of the page: [daviddavo.github.io/22CV](https://daviddavo.github.io/22CV)
