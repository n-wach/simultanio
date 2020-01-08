# SECRETS
. secrets.sh

# START
echo "Launching Gunicorn"
gunicorn __init__:app

