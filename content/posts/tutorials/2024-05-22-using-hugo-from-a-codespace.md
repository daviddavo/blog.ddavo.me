---
title: Using hugo from a GitHub codespace
description: In this tutorial we will learn how to set up GitHub codespaces to comfortably write your Hugo posts
date: 2024-05-22T17:54:42.962Z
preview: ""
draft: false
tags:
    - GitHub
    - tutorial
    - Hugo
categories:
    - tutorial
author: David Davó
slug: hugo-codespace
lastmod: 2024-05-22T18:28:03.974Z
math: false
type: tutorial
keywords:
    - github
    - hugo
    - codespace
---

Once again, this post is more like a tutorial for myself (because every time I want to write a post I forget how it worked) that then I decide to share with everyone.

## Setting up the devcontainer
The devcontainer file tells GitHub Codespaces how to create your file. You can find my current codespaces file [on GitHub](https://github.com/daviddavo/blog.ddavo.me/blob/main/.devcontainer/devcontainer.json).

Bellow, I copied the simplified version that was used while I was writing this post:

```json
{
	"name": "Ubuntu",
	// Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
	"image": "mcr.microsoft.com/devcontainers/base:jammy",
	"features": {
		"ghcr.io/devcontainers/features/hugo:1": {
			"extended": true
		},
		"ghcr.io/devcontainers-contrib/features/actionlint:1": {},
		"ghcr.io/devcontainers-contrib/features/gh-cli:1": {}
	},
	"customizations": {
		"vscode": {
			"extensions": [
				"eliostruyf.vscode-front-matter"
			]
		}
	},

	// Features to add to the dev container. More info: https://containers.dev/features.
	// "features": {},

	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	"forwardPorts": [1313],

	// You can use go mod instead
	"postCreateCommand": "git submodule update --init",
}
```

The most important part is `forwardPorts`, as it will "open" the port that hugo server uses. You can also specify what extensions you want to be installed. I really like FrontMatter, as it has multiple useful features for writing blog posts.

## Running hugo

Finally, we have to run hugo, which is, surprisignly, the most difficult part. I just wrote this post to save and publish this command.

We will use some readily available environment variables to set the base url, that is changed by github to allow you and only you to access the open port.

- `CODESPACE_NAME`: This is the name of the codespace, e.g.: curly-fortnight-asfajkghajhgajhg
- `GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN`: This is the base domain that github uses for these redirects: `app.github.dev`

We can combine these two variables to create the URL that will be used by your blog, and enter it into hugo:

```bash
hugo server -D --appendPort=false --baseURL https://$CODESPACE_NAME-1313.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
```

## Ussing FrontMatter's RUN SERVER button

To finish, the Front Matter extension has a cool "START SERVER" button, we can set what it does by just modifying Visual Studio's config, and then we will just have to press that button.