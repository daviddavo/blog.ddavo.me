---
title: How to override some domain names in your local network
date: 2021-12-22T13:17:17+01:00
author: David Davó
tags:
  - tutorial
  - dns
  - self-hosting
  - homelab
showToc: true
keywords:
  - lan
  - local network
  - domain name
description: In this tutorial you will learn how to override some domain names in your
  local network configuring a Response Policy Zone in the bind9 server
---
If you have a small home local network, perhaps you've had problems accessing your domain names.
As you may already know, in your home network you have a public IP (given by your ISP) and a set of private or local IP addresses used among your devices in your local network.
The technology that allows mapping a lot of private addresses to a unique public address is called masquerading or Network Address Translation (NAT).

Issues arise when you use a DNS to assign a domain name to a service. For example, let's say you have a blog, and you want to map the domain `blog.example.com` to the public IP `1.2.3.4`. In your router, you do a port mapping to the device with a local address `192.168.1.66`. But when you want to access `blog.example.com` in your web browser inside your local network... it doesn't work! It says something along the lines of "Unable to connect to the host" -- but the host is just right THERE! --.
The thing is, your computer is trying to connect to `1.2.3.4` (the address resolved by the DNS), when what you really want is to connect to `192.168.1.66` (your local address). You could modify the `/etc/hosts` file in every device in your home, but there's an alternative: hosting your own DNS.

> Requirements before reading this post
> - Knowing what is DNS and how to change the records in your registrar

## BIND: The ubiquitous Domain Name System server
With the Domain Name System, you ask a Domain Name server for the IP associated to a Domain Name. I'm pretty sure that you already have a bind system in your home without you knowing it, your ISP given router. In fact, having a DNS server in your LAN has a lot of advantages, because you are querying a device located 10 meters from you, instead of a server hundreds of kilometers from you.

To override some records we can use a _Response Policy Zone_ (RPZ), which allows us to override some domain name mappings inside our local network. 

Let's see how to set up everything

## Installing BIND

Depending on your Linux distro or your operating system, the installing process (and the files to modify) may vary. In this tutorial, we use a machine with Debian/Ubuntu. We just need to install a couple of packages, using the following command:

```console
$ sudo apt install bind9 bind9utils bind9-doc
```

## BIND configuration for your local network

> Remember: To be able to modify these file you'll need to be root or use `sudo`

First, we need to set up a new zone to add our subdomains, we are going to call it "rpz", and we'll set its DNS database at `/etc/bind/db.rpz`. We'll edit the file `/etc/bind/named.conf.default-zones` and add the following lines:

```
zone "rpz" {
    type master;
    file "/etc/bind/db.rpz";
}
```

Now, we add our records to the database (`/etc/bind/db.rpz`)
```
; Our LAN records
$TTL 3600

; These two records specify which is the DNS for this zone
@		IN	SOA	localhost. root.localhost. (
			      2		; Serial
			 604800		; Refresh
			  86400		; Retry
			2419200		; Expire
			 604800 )	; Negative Cache TTL
@		IN	NS	localhost.

; Using $ORIGIN we can add only the subdomain and not the full domain
$ORIGIN example.com

nas                  A       192.168.1.42              ; IPv4 address of nas.example.com
nas                  AAAA    fe80::1ff:fe23:4567:890a  ; IPv6 address of nas.example.com
ftp                  CNAME   nas                       ; Un simple alias of ftp.example.com a nas.example.com
blog.example2.org.   A       192.168.1.31              ; We can also add fully qualified domain names
```

But we need to tell the DNS to ask for the records (domain name) it doesn't have in its database to another server. For this, we need to enable _recursion_ and to specify the upstream servers to ask when we don't have the record in our RPZ.

> The forwarders servers can be given by your ISP, or your local router (192.168.1.1), but I recommend using Google's or Cloudflare's DNS servers because of their reliability and speed.

```
options {
	directory "/var/cache/bind";

	recursion yes; # Enabling recursion
	listen-on { 192.168.1.11; }; # The IP address of THIS DNS server
	# You can set it to any if you want it to listen to petitions
	# from outside
	allow-transfer { none; };
	response-policy { zone "rpz"; }; # The response policy zone name

	forwarders {
		8.8.8.8;
		8.8.4.4;
		1.1.1.1;
	};

	dnssec-validation auto;

	listen-on-v6 { any; }; # You can set it to "none" if you don't want to use IPv6 DNS
};
```

### Starting the DNS server

To apply the changes, we start the server using systemctl

```console
$ sudo systemctl enable --now bind9
```

We can check whether it works using `dig` (perhaps you need to install it first),
which allows us to make queries to a given DNS server instead of using the default.

First, we check if usual queries work, like google.com
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

Now we check that our RPZ works
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

**It works!!** The returned IP address is the address from our local network, instead of the global one.

### Using the DNS server

Nevertheless, it doesn't work in the web browser, or with any other program apart from `dig`...

We need to set our DNS server as the default DNS in each device. Every device is different, but it shouldn't be very difficult. Perhaps your router can propagate its config using DHCP through the local network!

If you have any questions, you can let me know in the comments

## Sources & more information
- [Serverfault.com: Overriding some DNS entries in BIND for internal networks](https://serverfault.com/questions/18748/overriding-some-dns-entries-in-bind-for-internal-networks)
- [Wikipedia: Response policy zone](https://en.wikipedia.org/wiki/Response_policy_zone)
- [Wikipedia: Network Address Translation](https://en.wikipedia.org/wiki/Network_address_translation)
- [dnsrpz.info](https://dnsrpz.info/)
