rm -rf _build_site/*
gulp buildSite --env=production --type=site
echo "--> Generando ZIP"
cd _build_site/
zip  -qq ../_deploy_server/site.zip -r .
cd ..
echo "--> Copiando ZIP al servidor"
scp -P 2298 _deploy_server/site.zip incloux@45.55.102.85:/var/www/site.zip
echo "--> Generando Deploy"
ssh incloux@45.55.102.85 -p 2298 "rm -rf /var/www/lengolo.menu/*;unzip -qq /var/www/site.zip -d /var/www/lengolo.menu/;rm /var/www/site.zip"
#head -n 4 _build_site/content/assets/js/version.js
