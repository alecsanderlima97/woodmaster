$vars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyB6kHYXssB79SguyeyaXNglZYo-K3elJsU"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "woodmaster-saas-001.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "woodmaster-saas-001"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = "woodmaster-saas-001.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "354776744552"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:354776744552:web:672b29c2135bc6684ff1dd"
}

foreach ($key in $vars.Keys) {
    $val = $vars[$key]
    Write-Host "Forcing Sync for $key..."
    # Remover se existir (ignora erro se não existir)
    npx -y vercel env rm $key production --yes 2>$null
    npx -y vercel env rm $key preview --yes 2>$null
    npx -y vercel env rm $key development --yes 2>$null
    
    # Adicionar novamente para todos os ambientes
    Write-Output $val | npx -y vercel env add $key production --yes
    Write-Output $val | npx -y vercel env add $key preview --yes
    Write-Output $val | npx -y vercel env add $key development --yes
}

Write-Host "Force Sync Completed! Triggering new deploy..."
npx -y vercel --prod --force --yes
