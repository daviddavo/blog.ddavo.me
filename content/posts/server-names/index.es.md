---
title: ¿Cómo se llaman mis servidores?
date: 2023-09-03T11:19:15.811Z
tags:
  - personal
  - homelab
categories: []
author: David Davó
lastmod: 2023-09-05T08:33:08.398Z
math: false
type: ""
cover:
  image: permanence.webp
  alt: Composición del logotipo de Correos, Amiami, y Aduanas de España
---

Cuando uno monta un servidor, una de las primeras cosas que debe establecer es su _hostname_ y, aunque no le demos un botellazo como a los barcos, hay que bautizarlo.

Como los servidores los montan informáticos y estos tienden a ser un poco frikis, los pobres acaban con nombres... curiosos. En las grandes empresas suele haber estándares estrictos sobre como debe ser el nombre, normalmente con siglas, acrónimos y números indescifrables para alguien que no trabaje allí. Pero las pequeñas empresas y los que tenemos servidores por hobby tenemos más libertad, y ahí es donde comienza la fiesta.

En un principio, mis equipos tenían nombres sosos: _davo-pc_ y _davo-laptop_. Pero todo cambió cuando compré mi primera Raspberry Pi. En un principio era _rpi_ o algo por el estilo, el nombre por defecto, vamos. Empezó a dar fallos y había que reiniciarla del botoncito, así que decidí poner una nueva tarjeta y, ya que estaba, re-instalar el SO en el resto de equipos y así borrar todos los programas tochos que había tenido que instalar para la uni.

Por esa época, yo estaba viendo el anime de ciencia ficción  _Space Battleship Yamato_. En esta serie, la humanidad se ha diezmado por una pandemia y unos valientes deben ir en el barco espacial _Yamato_ desde la tierra (_Chikyuu_ en Japonés) hasta _Iscandar_, el planeta donde se encuentra la cura. Por esa razón, decidí llamar a mi raspberry **Chikyuu**, a mi pc principal y servidor secundario **Iscandar** y, al portátil que usaba desde fuera de casa para conectarme a ambos, **Yamato**. Además, este tocho portátil de varios kilos era igual de basto que el propio Yamato.

{{< figure src="yamato.webp" alt="Visualización del barco destructor Yamato, en el espacio" caption="El famoso Barco Espacial Yamato surcando los confines del espacio hacia Iscandar. Fuente: [Crunchyroll](https://www.crunchyroll.com/es-es/series/GG5H5X3Z9/space-battleship-yamato)">}}

Poco después, canibalicé un antiguo portátil con a penas 4GB de RAM para instalarle docker y empezar a formar mi pequeño clúster. Como se situaba físicamente al lado de chikyuu y, además, necesitaba estar conectado todo el rato a él para acceder a sus archivos, decidí llamarlo **tsuki** (Luna en Japonés).

Un par de años más tarde, recibí un portátil nuevo, y volvieron las dudas. Decidí mantener la tradición de que los equipos fijos tuviesen nombre de cuerpos celestes (reales o ficticios), y los portátiles de ¿nave espacial? Bueno, coso del espacio, dejémoslo así.

Pero esta vez estaba viendo otro anime de ciencia ficción distinto: Mobile Suit Gundam: The Witch from Mercury. 
En este caso, el nuevo portátil fue bautizado como **Aerial**, igual que el mecha de la protagonista de la serie. Limpié el antiguo Yamato, le instalé un disco duro nuevo con un sistema operativo de servidor, con el objetivo de que se convirtiese en mi servidor multimedia y que tsuki no trabajase tanto. Este "nuevo" servidor recibió el nombre de _Suisei_ (Mercurio en Japonés), en honor al planeta de origen de la protagonista.

{{< figure src="aerial.webp" alt="Suletta Mercury y su robot Aerial" caption="Suletta Mercury y su robot mecha Aerial. Fuente: [Pixiv](https://www.pixiv.net/en/artworks/107380318)">}}

Los nombres que elegimos para los servidores reflejan nuestros intereses y experiencias, cada nombre cuenta una historia. Para los que tenemos este hobby, nuestros dispositivos se convierten en algo más que simples herramientas, son _personajes_ dentro de nuestra épica y narrativa, personajes por los que llegamos a sentir cierto cariño u orgullo, por los que sentimos cierta pena cuando dejan de funcionar y hay que desconectarlos de la red tras años de servicio. Asi que, la próxima vez que estés configurando un equipo, recuerda que el nombre que le das puede ser mucho más que una etiqueta, es una forma de expresar nuestra conexión personal con la tecnología, un arte.