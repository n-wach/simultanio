# SECRETS
. secrets.sh

# START
echo "Launching Gunicorn"
gunicorn startup:app -k eventlet -w 1

