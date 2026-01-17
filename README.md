# Twitch Chat - Application Next.js

Application de chat Twitch en temps réel construite avec Next.js, TypeScript et Tailwind CSS.

## Fonctionnalités

- ✅ Connexion au chat Twitch en temps réel
- ✅ Affichage des messages avec couleurs personnalisées
- ✅ Badges utilisateurs (broadcaster, modérateur, VIP, abonné)
- ✅ Interface moderne avec Tailwind CSS
- ✅ Mode lecture seule (anonyme) ou mode connecté
- ✅ Auto-scroll vers les nouveaux messages
- ✅ Design responsive

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Lancer le serveur de développement :

```bash
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Utilisation

1. Entrez le nom du canal Twitch (sans le #)
2. Optionnellement, entrez un nom d'utilisateur (laissez vide pour le mode anonyme)
3. Cliquez sur "Se connecter"
4. Les messages du chat apparaîtront en temps réel

## Note importante

Pour envoyer des messages dans le chat, vous devez vous authentifier avec un token OAuth Twitch. En mode anonyme (sans nom d'utilisateur), vous pouvez uniquement lire les messages.

Pour obtenir un token OAuth :
1. Allez sur https://twitchtokengenerator.com/
2. Générez un token avec les permissions `chat:read` et `chat:edit`
3. Modifiez le code pour utiliser ce token dans la connexion

## Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **tmi.js** - Client Twitch IRC

## Structure du projet

```
twitch-board/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatContainer.tsx
│   ├── ConnectionPanel.tsx
│   ├── MessageList.tsx
│   └── MessageInput.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

