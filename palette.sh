
# Termino tutti i container
docker stop $(docker ps -a -q)

# Istallo CertBot
apt install snapd
snap install --classic certbot

# Tolgo il vecchio certificato (Tutti i domini stanno su un certificato solo)
certbot delete --cert-name vsync.it

# Rinnova i certificati adesso E quando scadono
certbot certonly --webroot -w ~/public -d vsync.it -d booru.vsync.it -d api.booru.vsync.it --deploy-hook "docker stop nginx && sh ~/vsync/docker.sh"

# Riavvio Nginx
docker stop nginx && sh ~/vsync/docker.sh
