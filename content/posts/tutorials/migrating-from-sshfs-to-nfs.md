---
title: Migrating from SSHFS to NFS
date: 2023-08-28T15:40:21.871Z
draft: false
tags:
  - tutorial
  - self-hosting
author: David Davó
lastmod: 2023-08-28T21:13:12.689Z
math: false
---

First of all, this is not a tutorial, this is more like a lab notebook of my experience trying to ditch sshfs and start using NFS.

The main problem I had with sshfs is that it is not very reliable as a file system to remain mounted 24/7. For example, I had some problems unmounting it when it got stuck in a machine, creating lots of zombie processes. The only solution was to literally restart the machine... Furthermore, its [GitHub repo](https://github.com/libfuse/sshfs) was archived more than a year ago, so these issues will not be addressed soon.

## Previous setup

Instead of mounting the volume(s) using fstab, I decided to use a `.mount` file. It is a systemd unit that you can enable/disable using the `systemctl` command. You can check if the unit was successfully mounted just using `systemctl status`. In most systems, a `fstab` entry will just be converted to a `.mount` unit anyway. I discovered it recently, but you can just do `systemctl cat -- -.mount` and see the unit file created to mount your root filesystem.

In my case, the unit file I created was:
```ini
[Unit]
Description=Mount publicmedia (/mnt/chikyuu/tdarr/PublicMedia)

[Mount]
# chikyuu hostname defined in /etc/hosts
What=tdarr@chikyuu:PublicMedia
Where=/mnt/chikyuu/tdarr/PublicMedia
Type=fuse.sshfs
Options=noauto,port=222,x-systemd.automount,_netdev,user,default_permissions,allow>
#TimeoutSec=seconds

[Install]
WantedBy=multi-user.target
```

It's a lot easier to read, modify and check than using just `fstab`.

## New setup

I configured the NFS server using [openmediavault](https://www.openmediavault.org/), installed on a Raspberry Pi using Armbian. It was as easy as any other config method. The only difference is that NFS by default doesn't make any user id translations, but in my case it was fine as I preferred having the original user and groups ids. I had to create the groups on the client machines and change some uids.

You can create a group with a certain group id using the following command:
```bash
sudo groupadd -g "gid" "group name"
```

It's similar for users, with the command `useradd`
```bash
sudo useradd -u "uid" "user name"
```

Then, you can add your personal user to a certain group using `usermod`

```bash
sudo usermod -a -G "group name" "user name"
```

Now, the `.mount` file is more simple, as you don't need anything to do with permissions, and you don't need an IdentityFile. It seems less secure, but I configured the server so only some devices (which are on a separate VLAN) can access the NFS.

```ini
[Unit]
Description=Mount publicmedia (/mnt/chikyuu/tdarr/PublicMedia)

[Mount]
# chikyuu hostname defined in /etc/hosts
What=chikyuu:/PublicMedia
Where=/mnt/chikyuu/tdarr/PublicMedia
Type=nfs4
Options=rw,noauto,x-systemd.automount,x-systemd.mount-timeout=10,x-systemd.idle-timeout=1hour

[Install]
WantedBy=multi-user.target
```

And this is everything, I just restarted the service and everything went smoothly. I still don't know if it hangs less often, as sshfs hanged just one or two times each month.

### Bonus: Mounting using docker-compose

The fact is, I don't even need the service anymore. I used to mount the filesystem to make it available to some docker containers. But now I can just define it inside the `docker-compose.yml` file like this:

```yml
volumes:
  nfs_publicmedia:
    driver_opts:
      type: nfs4
      o: addr=192.168.1.31,nolock,soft,rw
      device: ':/PublicMedia'
services:
  ubuntu_test:
    image: ubuntu
    volumes:
      - nfs_publicmedia:/media
    command: ls /media && sleep 3600
```

There's no need anymore to mount the filesystem in each machine, it is automatically deployed thanks to docker stack!