---
title: Como encriptar tu home y desencriptarla automágicamente
date: '2022-01-30T15:38:09.185Z'
author: David Davó
tags:
    - tutorial
    - crypt
    - manjaro
    - archlinux
showToc: true
lastmod: '2022-01-31T21:10:15.725Z'
---
Alguna que otra vez toca llevar de paseo el portátil por las calles y el Metro de Madrid, con todos los riesgos que ello conlleva.

El portátil en sí no me da mucha pena, pero en el disco duro hay datos. Datos relevantes.
Todos pensamos que no hemos hecho nada malo y que no tenemos nada que ocultar... --"¿por qué iba a
querer encriptar cosas si no soy de la mafia?"

Pero seguro que tienes una o dos copias de tus DNIs. Tanto caducados como vigentes. Y también tendrás
alguna factura con tu dirección de casa, y correos electrónicos con alguna contraseña, y papeles de la universidad/trabajo, y... Pues eso.

![Gif from The Office with Dwight saying "Identity Theft is not a joke, Jim!"](/gifs/dwight-theoffice-identity-theft.gif)
> El robo de identidad no es una broma, Jim!
> -- Dwight K. Schrute

Por eso vamos a aprender a encriptar TODA tu carpeta home personal, con un método que funciona en Arch Linux y otras distros derivadas como Manjaro.

> **¡¡ANTES DE CONTINUAR!!**
>
> Has de tener cuidado porque los datos encriptados, en caso de perder la clave o 
> la contraseña, no podrán ser recuperados de ninguna forma (o por lo menos, esa es la idea)

# Migrando el `home`

Es sencillo, simplemente debemos llamar, desde el usuario `root`, a un script que viene ya hecho y te configura todo él solito.
Eso sí, vas a necesitar más o menos 2.5 veces el espacio de tu carpeta `$HOME`, por lo que borra primero la caché y todo lo que
no te preocupe mucho borrar. Ese espacio extra podrá ser liberado después del proceso, así que en el peor de los casos puedes mover algunas cosas a otro disco duro, y luego volver a dejarlas donde estaban.

Antes de continuar, necesitarás asegurarte de que los siguientes comandos están instalados y funcionando:
- [ ] `rsync`
- [ ] `lsof`
- [ ] `which`

Inicia sesión con el usuario root (**no vale usar tu usuario con `sudo`**). Una vez hayas comprobado que los comandos funcionan, debemos cargar el módulo del kernel encargado de la encriptación, usando `modprobe`

```terminal
$ modprobe ecryptfs
```

Finalmente, antes de comenzar con la migración, asegurate de que ningún proceso del usuario del que quieres migrar está ejecutándose, pues podría dar problemas. Puedes usar `ps -U <usuario>` (si la lista está vacía, es que no hay ningún proceso siendo ejecutado por ese usuario). Ahora sí, tan sólo tienes que introducir el siguiente comando y seguir las instrucciones:

```terminal
$ ecryptfs-migrate-home -u <usuario>
```

Este comando te creará una "copia de seguridad" en `/home/<usuario>.<cadena>`, que deberías borrar una vez todo funcione correctamente.

# Habilitando el automontaje
Para habilitar el automontaje, usaremos un "módulo de autenticación conectable" o PAM (*Pluggable Authentication Module*). Es básicamente una especie de plugin del sistema de inicio de sesión de Linux, que en este caso nos permitirá montar una carpeta cifrada mientras iniciamos sesión (pero antes de cargar nuestro entorno de escritorio y esas cosas).

Vamos a editar el archivo `/etc/pam.d/system-auth`

------------------------------
**Después** de la línea `auth required pam_unix.so` (o `auth [default=die] pam_faillock.so authfail` si existe) inserta:
```
auth [success=1 default=ignore] pam_succeed_if.so service = systemd-user quiet
auth required                   pam_ecryptfs.so unwrap
```

------------------------------
**Sobre** la línea `password required pam_unix.so` (o `-password [success=1 default=ignore] pam_systemd_home.so` si existe), añade:
```
password    optional    pam_ecryptfs.so
```

------------------------------
Para terminar, **tras** la linea `session required pam_unix.so` pon:
```
session [success=1 default=ignore] pam_succeed_if.so service = systemd-user quiet
session optional                   pam_ecryptfs.so unwrap
```

Ahora ya puedes cerrar tu sesión de root e iniciar sesión con tu usuario normal.
Debería estar todo justo donde lo dejaste.

También puedes probar a iniciar sesión desde otro usuario (con tu sesión cerrada, claro), e intentar acceder a `/home/<nombreusuarioprotegido>`. ¿Que pasará?

# Fuentes y más información
- [eCryptfs - ArchWiki](https://wiki.archlinux.org/title/ECryptfs)
- [PAM - ArchWiki](https://wiki.archlinux.org/title/PAM)
- [pam_mount - ArchWiki](https://wiki.archlinux.org/title/Pam_mount)
