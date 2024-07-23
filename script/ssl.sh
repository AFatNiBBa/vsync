
# Rinnova i certificati adesso E quando scadono
certbot certonly --webroot -w ~/vsync/package/vsync/.output/public/ -d vsync.it

# Riavvio Nginx
sudo systemctl restart nginx