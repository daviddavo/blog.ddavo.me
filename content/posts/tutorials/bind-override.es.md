---
title: Cómo sobreescribir solo algunos subdominios en tu red local
date: 2021-12-22T13:17:17+01:00
authors:
    - ddavo
tags:
    - tutorial
    - dns
    - self-hosting
    - homelab
showToc: true
lastmod: 2024-08-04T18:17:00.667Z
---
Si tienes una pequeña red en casa, alguna vez habrás tenido problemas con el tema de dominios.
Como ya sabrás, está la IP pública (la que se ve desde fuera de tu red, y conecta con el router), y las IPs privadas (las de tu red local, que empiezan por 192.168.0...).
Esta tecnología de asignar varias "IP privadas" a una única "IP pública" se llama enmascaramiento o "Traducción de Direcciones de Red" (NAT por sus siglas en inglés).

Esto puede causar problemas si usas DNS para asignarle un nombre de dominio a un servicio. Pongamos que tienes un blog, y le asignas el dominio `blog.example.com` a la IP pública `1.2.3.4`. En tu rúter mapeas los puertos a tu dirección local `192.168.1.66`, pero cuando quieres acceder a `blog.example.com`... ¡no funciona! Te dirá que no se puede conectar al 
host o algo así --¿Cómo que no? ¡Si lo tengo aquí al lado!--. Lo que pasa es que
tu ordenador se está intentando conectar a la dirección `1.2.3.4`, cuando lo que en
realidad quieres es acceder a la dirección `192.168.1.66`. Una alternativa sería modificar
el archivo hosts, pero si quieres modificarlo en todos los dispositivos de tu red local a la vez, existe
otra solución: ¡cambiar los DNS! Pero no el DNS de todo el mundo, porque dejaría de funcionar tu web para la gente que no esté en tu red local. El truco está en cambiar únicamente los DNS dentro de tu red local.

> Requisitos antes de seguir:
> - Saber un poco qué es DNS y como cambiar los registros desde el panel de tu registrador de nombres de dominio.

## BIND: Tu servidor DNS de confianza
Bind es un servidor DNS, al que tú le preguntas un nombre de dominio (como google.es) y este te responde su dirección IP ([142.250.200.131](http://142.250.200.131)). Lo más
seguro es que ya tengas un servidor bind en casa sin que tú lo sepas: el del rúter de la compañía telefónica. Y esque tener un servidor DNS en tu red local tiene muchas ventajas, sobre todo porque las consultas se hacen a un dispositivo que está a 10 metros, y no a un servidor a 100km.

Lo de sobreescribir algunas entradas es posible gracias al mecanismo [RPZ](https://dnsrpz.info), o _Políticas de Zonas de Respuesta_, que nos permite establecer espacios
de nombres de dominio especiales que sobreescriban a otros. 

Ahora veremos como instalar y montar todo.

## Instalar bind

Dependiendo tu distro de linux o tu sistema operativo, el proceso de instalación será diferente. En este caso el tutorial se ha realizado con una máquina con Debian/Ubuntu.
Tan sólo es necesario instalar un par de paquetes, introducir en la terminal el siguiente comando.

```
sudo apt install bind9 bind9utils bind9-doc
```

## Configurando BIND

> Recuerda que para modificar estos archivos es necesario ser root o usar `sudo`

Lo primero es configurar una nueva zona a la que añadir nuestros subdominios, la vamos a llamar "rpz", y estableceremos
su "base de datos" en el fichero `/etc/bind/db.rpz`. Para ello editamos el fichero `/etc/bind/named.conf.default-zones` y añadimos las siguientes líneas:

```
zone "rpz" {
    type master;
    file "/etc/bind/db.rpz";
}
```

Ahora editamos la base de datos donde se encuentran nuestros dominios (`/etc/bind/db.rpz`), añadiendo todos los registros que queramos.

```
; Fichero para mi LAN (Red de Área Local)
$TTL 3600

; Estas dos entradas indican cual es el servidor DNS al que consultar (este mismo)
@		IN	SOA	localhost. root.localhost. (
			      2		; Serial
			 604800		; Refresh
			  86400		; Retry
			2419200		; Expire
			 604800 )	; Negative Cache TTL
@		IN	NS	localhost.

; Si establecemos un $ORIGIN, solo es necesario indicar el subdominio
$ORIGIN example.com

nas                  A       192.168.1.42              ; Dirección IPv4 de nas.example.com
nas                  AAAA    fe80::1ff:fe23:4567:890a  ; Dirección IPv6 de nas.example.com
ftp                  CNAME   nas                       ; Un simple alias de ftp.example.com a nas.example.com
blog.example2.org.   A       192.168.1.31              ; También podemos añadir dominios completos
```

Además, el objetivo también es que todas las direcciones que tu servidor no conozca, se las pregunte a otro servidor. Para ello es necesario habilitar la recursión y especificar
los servidores a los que preguntar en caso de no encontrar la entrada en el rpz.


> Los servidores a los que preguntar pueden ser dados por tu ISP, también puede ser tu rúter (192.168.1.1). Yo recomiendo usar los de Google/Cloudflare por su fiabilidad y rapidez.

```
options {
	directory "/var/cache/bind";

	recursion yes; # Habilitamos la recursión
	listen-on { 192.168.1.11; }; # La dirección IP de nuestro servidor
	allow-transfer { none; };
	response-policy { zone "rpz"; } break-dnssec yes; # La response policy zone

	forwarders {
		8.8.8.8;
		8.8.4.4;
		1.1.1.1;
	};

	dnssec-validation auto;

	listen-on-v6 { any; }; # Puedes poner "none" si no quieres que funcione por ipv6
};
```

> Es importante decirle al servidor que ignore las peticiones "seguras",
> de no ser así, podría devolver una dirección firmada, pero incorrecta.

### Arrancando el servidor

Para aplicar los cambios, iniciamos el servidor con systemctl

```console
sudo systemctl enable --now bind9
```

Podemos probar que funciona con el comando `dig` (tal vez necesites instalarlo),
que nos permite hacer consultas a un servidor DNS en concreto (y no al por defecto)
del Sistema Operativo.

Primero probamos que funcionen las consultas normales, como a Google
```console
$ dig google.es
; <<>> DiG 9.16.23 <<>> google.es
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 5016
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: 01db1f47a27adb9e90e4c7fb61c24bc2bf8c6a88296c3923 (good)
;; QUESTION SECTION:
;google.es.			IN	A

;; ANSWER SECTION:
google.es.		300	IN	A	142.250.200.131

;; Query time: 39 msec
;; SERVER: 192.168.1.11#53(192.168.1.11)
;; WHEN: Tue Dec 21 22:48:50 CET 2021
;; MSG SIZE  rcvd: 82
```

Y ahora probamos que funcione nuestro RPZ
```console
$ dig chikyuu.ddavo.me @192.168.1.11
; <<>> DiG 9.16.23 <<>> nas.example.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 45881
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: d200bc3ba9741e2ab2c8935661c24b4b401d43ae997c39de (good)
;; QUESTION SECTION:
;nas.example.com.		IN	A

;; ANSWER SECTION:
nas.example.com.	5	IN	A	192.168.1.42

;; Query time: 0 msec
;; SERVER: 192.168.1.11#53(192.168.1.11)
;; WHEN: Tue Dec 21 22:46:51 CET 2021
;; MSG SIZE  rcvd: 89
```

**¡¡Parece que funciona!!** La dirección IP que nos retorna es la dirección de área local, en lugar de la global.

### Usando el servidor

Sin embargo, no funciona desde el navegador, ni desde cualquier otro programa que no sea `dig`...

Es necesario configurar los dispositivos de tu red para que usen la nueva dirección. Cada sistema operativo es un mundo, pero tampoco suele ser algo muy difícil.

Si te es posible, puedes cambiarlo directamente desde el rúter,
para que se propague al resto de dispositivos automágicamente.

## Fuentes y más información
- [Serverfault.com: Overriding some DNS entries in BIND for internal networks](https://serverfault.com/questions/18748/overriding-some-dns-entries-in-bind-for-internal-networks)
- [Wikipedia: Response policy zone](https://en.wikipedia.org/wiki/Response_policy_zone)
- [dnsrpz.info](https://dnsrpz.info/)
