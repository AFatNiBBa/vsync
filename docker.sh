
# Definisce una funzione che comunica se l'operazione precedente è andata a buon fine
f_check() {
  if [ $? -eq 0 ]; then
    res="\e[36m$2\e[0m"
  else
    res="\e[33m$3\e[0m"
  fi
  echo "$1: $res"
}

# Definisce una funzione che avvia un Docker non ancora avviato
f_start() {
  name="$1"
  image="$2"
  shift 2
  docker run --name $name --network vsync --rm -d $@ $image > /dev/null 2>&1
  f_check "Docker \"$name\"" "Started" "Skipped"
}

######################################################

# Ottengo il persorso della cartella corrente
DIR="$(dirname "$(realpath $0)")"

# Crea i volumi esterni per Docker
mkdir -p ~/data/shimmie ~/public
chmod 777 ~/data ~/public

# Crea una rete condivisa tra tutti i Docker
docker network create vsync > /dev/null 2>&1
f_check "Network" "Created" "Already exists"

# Esegui il container di Vsync
f_start vsync vsync

# Esegui il container di Shimmie
f_start shimmie shish2k/shimmie2:2 \
  -v ~/data/shimmie:/app/data

# Esegui il container di Nginx
f_start nginx nginx \
  -p 80:80 \
  -p 443:443 \
  -v "$DIR/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v ~/public:/var/www/static:ro \
  -v /etc/letsencrypt:/etc/letsencrypt:ro
