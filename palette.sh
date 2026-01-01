
# Istallo CertBot
apt install snapd
snap install --classic certbot

# Tolgo i vecchi certificati
certbot delete --cert-name vsync.it
certbot delete --cert-name shimmie.vsync.it

# Rinnova i certificati adesso E quando scadono
certbot certonly --webroot -w ~/public -d vsync.it -d shimmie.vsync.it --deploy-hook "docker stop nginx && sh ~/vsync/docker.sh"

# Riavvio Nginx
docker stop nginx && sh ~/vsync/docker.sh
