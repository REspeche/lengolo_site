$version = Get-Content -Path "D:\Proyectos Moodny\Dashboard_v1\src_site\version.js" | Out-String

$EmailFrom = "incloux@gmail.com"
$EmailTo = "agaliano@gmail.com"
$Subject = "New Site Moodny";
$Body = "Hi, the server has been updated with a new version numbered as <b>"+$version+"</b>. Get into https://moodny.com"
$SMTPServer = "smtp.gmail.com"
$SMTPClient = New-Object Net.Mail.SmtpClient($SmtpServer, 587)
$SMTPClient.EnableSsl = $true
$SMTPClient.Credentials = New-Object System.Net.NetworkCredential("incloux@gmail.com", "Incloux123$");
$SMTPClient.Send($EmailFrom, $EmailTo, $Subject, $Body)
