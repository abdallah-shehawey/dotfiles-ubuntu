#!/bin/bash

DOWNLOAD_DIR="$HOME/videos_downloaded"
COOKIE_FILE="$HOME/cookies.txt"
DRIVE_FOLDER="gdrive:15Py9VYjQivP8TzeFCDqkDi9G75pQZXF9"

mkdir -p "$DOWNLOAD_DIR"

links=(
"https://eitesal-my.sharepoint.com/personal/alaa_tmmam_eitesal_org/_layouts/15/stream.aspx?id=%2Fpersonal%2Falaa%5Ftmmam%5Feitesal%5Forg%2FDocuments%2FRecordings%2FTech%20Makers%20Challenge%20%E2%80%93%20Orientation%20Session%2D20260308%5F213102%2DMeeting%20Recording%2Emp4"

"https://eitesal-my.sharepoint.com/personal/mohannad_eitesal_org/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmohannad%5Feitesal%5Forg%2FDocuments%2FRecordings%2FSession%201%20%20The%20Startup%20Journey%20%E2%80%93%20How%20to%20Build%20a%20Startup%2D20260312%5F185358UTC%2DMeeting%20Recording%2Emp4"

"https://eitesal-my.sharepoint.com/personal/mohannad_eitesal_org/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmohannad%5Feitesal%5Forg%2FDocuments%2FRecordings%2FSession%201%20%20The%20Startup%20Journey%20%E2%80%93%20How%20to%20Build%20a%20Startup%2D20260312%5F191026UTC%2DMeeting%20Recording%2Emp4"

"https://eitesal-my.sharepoint.com/personal/mohannad_eitesal_org/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmohannad%5Feitesal%5Forg%2FDocuments%2FRecordings%2FSession%202%20%20Build%2C%20Test%2C%20Innovate%20Accelerate%20Your%20Power%20Electronics%20Research%20with%20PEModule%2D20260314%5F115721UTC%2DMeeting%20Recording%2Emp4"

"https://eitesal-my.sharepoint.com/personal/mohannad_eitesal_org/_layouts/15/stream.aspx?id=%2Fpersonal%2Fmohannad%5Feitesal%5Forg%2FDocuments%2FRecordings%2FSession%203%20%20Building%20the%20Core%20%E2%80%93%20Value%20Proposition%20%26%20Business%20Model%20Canvas%2D20260317%5F191615UTC%2DMeeting%20Recording%2Emp4"
)

echo "🚀 Start..."

for link in "${links[@]}"; do

    echo "⬇️ Downloading..."

    yt-dlp \
        --cookies "$COOKIE_FILE" \
        --continue \
        --no-part \
        --concurrent-fragments 5 \
        --retries 10 \
        --fragment-retries 10 \
        --file-access-retries 10 \
        --output "$DOWNLOAD_DIR/%(title)s.%(ext)s" \
        "$link"

    # آخر ملف اتنزل
    FILE=$(ls -t "$DOWNLOAD_DIR" | head -n 1)

    echo "☁️ Uploading $FILE ..."

    rclone copy "$DOWNLOAD_DIR/$FILE" "$DRIVE_FOLDER" -P

    echo "🧹 Deleting local copy..."
    rm "$DOWNLOAD_DIR/$FILE"

done

echo "✅ All Done"
