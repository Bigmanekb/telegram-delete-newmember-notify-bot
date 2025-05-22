# telegram-delete-newmember-notify
This bot removes system messages when a new user joins the public group

## Bot Setup Instructions

For the bot to work properly, follow these steps:

### 1. Rename Configuration Files
```bash
mv env_sample .env
mv config/chats_sample.json config/chats.json
```

### 2. Configure `.env` File
Add the following required variables to `.env`:
```ini
BOT_TOKEN: 'your_bot_token_here'
MAIN_ADMIN: 123456789  # Main admin (who can add bot to groups)
BOT_ID: 987654321      # Prevents errors when deleting "bot added" notifications
```

### 3. Configure `config/chats.json`
Add group IDs where the bot should delete "new member" notifications:
```json
[
  -1001234567890,
  -1000987654321
]
```

### 4. Start the Bot
After configuration, run:
```bash
docker compose up -d --build
```
