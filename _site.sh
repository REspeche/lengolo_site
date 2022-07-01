rm -rf _build_site/*
gulp buildSite --env=production --type=site
echo "--> Generando ZIP"
cd _build_site/
zip  -qq ../_deploy_server/site.zip -r .
cd ..
echo "--> Copiando ZIP al servidor"
sshpass -p "Ricard0Espech3" scp -P 2298 _deploy_server/site.zip incloux@45.55.102.85:/var/www/site.zip
echo "--> Generando Deploy"
sshpass -p "Ricard0Espech3" ssh incloux@45.55.102.85 -p 2298 "rm -rf /var/www/menu.lengolo/*;unzip -qq /var/www/site.zip -d /var/www/menu.lengolo/;rm /var/www/site.zip"
#head -n 4 _build_site/content/assets/js/version.js
