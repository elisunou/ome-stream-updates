# OME Stream 1.5.110

Această versiune este disponibilă separat pentru Android Mobile și Android TV, fiecare în variantele `arm64-v8a`, `armeabi-v7a`, `x86` și `x86_64`.

**Important pentru cei cu 1.5.109:** verificați arhitectura procesorului dispozitivului și descărcați APK-ul cu aceeași arhitectură și tip de dispozitiv (Mobile sau TV). Instalați-l peste aplicația existentă, fără dezinstalare, pentru a păstra datele. Versiunea 1.5.109 nu poate alege automat între aceste APK-uri; această trecere se face manual. Începând cu 1.5.110, aplicația poate alege automat APK-ul compatibil la actualizările viitoare, dacă sunt publicate variantele pentru fiecare arhitectură.

- Temă Cinematic cu imaginea promovată fixă și mod deschis/întunecat.
- TV Live: Favorite, Toate și categoriile în rânduri; „VEZI TOT” deschide grila completă, inclusiv în landscape.
- Pagina și poziția de derulare sunt păstrate la rotire și la schimbarea modului Cinematic.
- Iconiță nouă pe Mobile și banner nou în lista de aplicații Android TV.
- TV Live, autentificarea Google și comenzile telecomenzii din 1.5.109 rămân disponibile.

Arhitectura trebuie verificată pe dispozitiv; numele modelului singur nu este suficient. `arm64-v8a` este pentru Android 64-bit ARM, `armeabi-v7a` pentru ARM 32-bit, iar `x86`/`x86_64` pentru dispozitive Intel sau emulatoare. Dacă aveți acces ADB, comanda `adb shell getprop ro.product.cpu.abi` arată varianta principală.
