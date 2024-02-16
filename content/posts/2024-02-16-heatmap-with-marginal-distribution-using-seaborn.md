---
title: HeatMap with marginal distribution using seaborn
description: ""
date: 2024-02-16T12:54:27.196Z
draft: true
tags:
    - data visualization
    - graphs
    - heatmap
    - seaborn
categories:
    - python
author: David Davó
lastmod: 2024-02-16T15:58:27.706Z
math: false
---

In this short post I will just share the code on how I created a very neat Heatmap for my Master's Thesis using [Seaborn](https://seaborn.pydata.org).

For this, I used the [JointGrid](https://seaborn.pydata.org/generated/seaborn.JointGrid.html#seaborn.JointGrid) tool, which allows me to make a multi-plot grid for conditional relationships, where we can show the marginal distributions on the top and right parts of the graph.

The [jointplot](https://seaborn.pydata.org/generated/seaborn.jointplot.html#seaborn.jointplot) function has already many things built in, for plotting something like a scatter plot (with x and y variables) while showing its distribution.

{{< figure src="https://seaborn.pydata.org/_images/jointplot_17_0.png" caption="Sample figure from Seaborn's official documentation" >}}

