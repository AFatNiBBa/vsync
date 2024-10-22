
# Cancello i vecchi file del server
rm -r ~/vsync

# Eseguo il server
PORT=80 node ~/vsync/server/index.mjs

# Tolgo i vecchi certificati
certbot delete --cert-name vsync.it

# Rinnova i certificati adesso E quando scadono
certbot certonly --webroot -w ~/vsync/public/ -d vsync.it --deploy-hook "systemctl restart nginx"

# Riavvio Nginx
systemctl restart nginx