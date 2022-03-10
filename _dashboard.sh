rm -rf _build_dashboard
gulp buildDashboard --env=production --type=dashboard
echo "--> Generando ZIP"
cd _build_dashboard/
zip  -qq ../_deploy_server/dashboard.zip -r .
cd ..
echo "--> Copiando ZIP al servidor"
sshpass -p "Ricard0Espech3" scp -P 2298 _deploy_server/dashboard.zip incloux@45.55.102.85:/var/www/dashboard.zip
echo "--> Generando Deploy"
sshpass -p "Ricard0Espech3" ssh incloux@45.55.102.85 -p 2298 "rm -rf /var/www/dashboard.lengolo/*;unzip -qq /var/www/dashboard.zip -d /var/www/dashboard.lengolo/;rm /var/www/dashboard.zip"
#head -n 4 _build_dashboard/assets/js/version.js
