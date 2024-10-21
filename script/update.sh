
# Cancello la vecchia cartella di output per evitare di lasciare merda dopo l'invio dei nuovi file
rm -r ~/vsync

# Aspetto che l'utente confermi che i nuovi file sono stati inviati
read -p 'Esegui "npm run save" sul client poi premi invio' _

# Eseguo il server
PORT=80 node ~/vsync/server/index.mjs