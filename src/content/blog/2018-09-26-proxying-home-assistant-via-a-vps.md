---
title: "Proxying Home Assistant through a VPS"
date: "2018-09-26"
categories: home automation, home assistant, servers
---

If you don't want to hear my story you can [skip to the guide by clicking here.](#the-guide)

My internet provider, like everyone else's it seems, sucks. They've provided me with a router which has the worst Wifi I've ever seen and they do not allow me to visit my public IP internally for some reason. 

The first is not that much of an issue since it can easily be solved through a second router with better Wifi. In my case a TP-Link Deco mesh network.

The second, however, gave me some headache. Initially I thought that the router was being a dick and not letting me forwarding any ports. This was not the case, and contacting my ISP I was told these routers came with a "feature" that blocked internals from accessing anything on the network through the public IP address. A quick VPN check confirmed that my Home Assistant was indeed accessible from the world wide web. 

I've recently started learning Docker and one of the things I've been doing a lot lately is proxying traffic from a load balancer to a container. Digging deeper this is also how things like the Hass.io addons for NGINX work. They proxy the traffic from one Nginx docker container to the Home Assistant docker container. But those containers wouldn't do much for me, since I only would be able to see my Hass.io instance from the outside. 

I don't want to have to switch from the internal address to an external address every time I log on and off my network. Initially I was considering the building a Hass.io addon that used Ngrok. I'm pretty sure the ngrok daemon would restart every now and then, and with the free plan I would be given a new domain for my instance. That would mean some smart integrations with my domain host to update a CNAME record every time the daemon would restart. Sounds like a lot of work. The "Basic" (priced $5) plan of ngrok would allow me to add a custom domain, but I would still need to write a addon for Hass.io that integrates all this.

So, I went another route. Using a $2.50 VPS. After I set everything up I remembered AWS has a free-tier for their EC2 service. That would give you 750 hours a month on their t2.micro instances for one year. After that it would cost money. Amazon's pricing confuses me so I'm not gonna go into details on this. With AWS you could also utilize many of their other services, but from experience you'll just get too excited and end up with a $300 invoice from Amazon because you tested something and forgot to delete the instance. 

As this VPS will only serve as a proxy for our Home Assistant instance it won't require much resources. Unless you have hundreds of family members that all needs to access everything at the same time.

Finally the internet sees my home, and I can use the Home Assistant iOS app to send my location and receive notifications both home and away. 

## The Guide ##

I used a VPS from a company I found when I Googled "cheap vps": [VirMach](https://billing.virmach.com/aff.php?aff=5327). As far as I can tell they offer the cheapest VPS I could find at $2.50 a month. Vultr also offers a VPS at this price range, but you only get an IPv6 address. I needed an IPv4 address.

### Prerequisites 

1. A machine running Hassio on your local network
2. A DuckDNS account
3. The DuckDNS addon for Hassio installed and configured.
4. A VPS running Ubuntu 16.04 or greater.

### Installation

Start by getting the operating system up to date. 
```sh
sudo apt-get update
```

My instance had Apache2 running so I had to remove this.
```sh
sudo service apache2 stop
sudo apt-get purge -y apache2 apache2-utils apache2.2-bin apache2-common
```

Then install NGINX and nano (a text-editor)
```sh
sudo apt-get install -y nginx nano
sudo service nginx start
```

Now that your NGINX server is running we can create the proxy. Open your default site config.
```
sudo nano /etc/nginx/sites-enabled/default
```

And add this configuration. Change the URL `myhassioname.duckdns.org` to your duckdns URL.
```
upstream hassio {
    server myhassioname.duckdns.org:8123;
}

server {
    listen 80 default_server;

    server_name _;

    charset utf-8;

    location / {
        proxy_set_header Host heim.tormorten.no;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://hassio;
        proxy_redirect off;

        # Handle Web Socket connections
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Restart NGINX. 
```
sudo service nginx restart
```

Visit your server's IP address in your browser. You should now be prompted with the beautiful login to your Home Assistant instance.

## Going further

You'll notice the traffic is not encrypted. Everything here is running on the `http` protocol. You can solve this by adding a Lets Encrypt certificate to the above configuration, or use CloudFlare's free SSL certificate. My domain's DNS is already handled by CloudFlare, so it wasn't that much of a hassle for me and I really recommend it.


