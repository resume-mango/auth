RED='\033[0;31m'
NC='\033[0m' # No Color


echo ${RED}Setting Enviornment variables for auth repository${NC}

openssl base64 -A -in .env.development -out dev.txt
openssl base64 -A -in .env.staging -out test.txt
openssl base64 -A -in .env.production -out prod.txt

gh secret set DEV_ENV_BASE_64 < dev.txt
gh secret set STAGING_ENV_BASE_64 < test.txt
gh secret set PROD_ENV_BASE_64 < prod.txt

rm dev.txt
rm test.txt
rm prod.txt

