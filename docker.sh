
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
dir="$(dirname "$(realpath $0)")"

# Specifico la configurazione del database di SzuruBooru
# Il database è esposto solo sulla rete virtuale creata da me, quindi non c'è problema se il mondo conosce la password
szuru_db_name=szuru
szuru_db_user=szuru
szuru_db_pass=szuru

# Crea i volumi esterni per Docker
mkdir -p ~/data/szuru_db ~/data/szuru_server ~/public
chmod 777 ~/data ~/public

# Crea una rete condivisa tra tutti i Docker
docker network create vsync > /dev/null 2>&1
f_check "Network" "Created" "Already exists"

# Esegui il container di Vsync
f_start vsync vsync

# Esegui il container del database di SzuruBooru
f_start szuru_db postgres:11-alpine \
  -e "POSTGRES_DB=$szuru_db_name" \
  -e "POSTGRES_USER=$szuru_db_user" \
  -e "POSTGRES_PASSWORD=$szuru_db_pass" \
  -v ~/data/szuru_db:/var/lib/postgresql/data

# Esegui il container del server di SzuruBooru
f_start szuru_server szurubooru/server \
  -e "POSTGRES_HOST=szuru_db" \
  -e "POSTGRES_DB=$szuru_db_name" \
  -e "POSTGRES_USER=$szuru_db_user" \
  -e "POSTGRES_PASSWORD=$szuru_db_pass" \
  -v "$dir/szuru.yaml:/opt/app/config.yaml" \
  -v ~/data/szuru_server:/data

# Esegui il container del client di SzuruBooru
f_start szuru_client szurubooru/client \
  -e "BACKEND_HOST=szuru_server" \
  -v ~/data/szuru_server:/data:ro

# Esegui il container di Nginx
f_start nginx nginx \
  -p 80:80 \
  -p 443:443 \
  -v "$dir/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v ~/public:/var/www/static:ro \
  -v /etc/letsencrypt:/etc/letsencrypt:ro
