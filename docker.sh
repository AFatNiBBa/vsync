
# Ottengo il persorso della cartella corrente
DIR="$(dirname "$(realpath $0)")"

# Crea i volumi esterni per docker
mkdir -p ~/shimmie ~/public
chmod 777 ~/shimmie ~/public

# Crea una rete condivisa tra tutti i docker
docker network create vsync

# Esegui il container di Shimmie
docker run \
  --name shimmie \
  --network vsync \
  --rm \
  -d \
  -v ~/shimmie:/app/data \
  shish2k/shimmie2:2

# Esegui il container di Vsync
docker run \
  --name vsync \
  --network vsync \
  --rm \
  -d \
  vsync

# Esegui il container di Nginx
docker run \
  --name nginx \
  --network vsync \
  --rm \
  -d \
  -p 80:80 \
  -p 443:443 \
  -v "$DIR/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v ~/public:/var/www/static:ro \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  nginx
