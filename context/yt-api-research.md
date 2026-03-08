Yes — here’s a practical cURL set for each screening question using the data you already have for @ashleyrosepeters:
channel ID: UCzwPKK7dTlO2W21g122MNkQ
uploads playlist: UUzwPKK7dTlO2W21g122MNkQ
These calls use the standard YouTube Data API endpoints:
channels.list for channel metadata
playlistItems.list for uploads
videos.list for video metadata + public stats
commentThreads.list for top-level comments. Every request needs either an API key or OAuth token.  
Set your key once:
export YT_API_KEY='YOUR_API_KEY'

1. Does this creator post about the right topics?
   First, get the channel summary and description:
   curl -s \
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=UCzwPKK7dTlO2W21g122MNkQ&key=${YT_API_KEY}"
   Then fetch the most recent uploads from the uploads playlist:
   curl -s \
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=20&key=${YT_API_KEY}"
   If you want a cleaner topic-review view with jq:
   curl -s \
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=20&key=${YT_API_KEY}" \
   | jq -r '.items[] | [.snippet.publishedAt, .snippet.title, .contentDetails.videoId] | @tsv'
   That gives you the recent titles and dates, which is usually the fastest public proxy for topic fit. playlistItems.list is the standard endpoint for retrieving items from a specific playlist, including a channel’s uploads playlist.
2. Are recent videos getting meaningful views?
   Step A: get recent video IDs:
   curl -s \
    "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=20&key=${YT_API_KEY}" \
   | jq -r '[.items[].contentDetails.videoId] | join(",")'
   Step B: plug those IDs into videos.list:
   curl -s \
    "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=VIDEO_ID_1,VIDEO_ID_2,VIDEO_ID_3&key=${YT_API_KEY}"
   Or in one shell pipeline:
   VIDEO_IDS=$(curl -s \
  "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=20&key=${YT_API_KEY}" \
    | jq -r '[.items[].contentDetails.videoId] | join(",")')

curl -s \
 "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${VIDEO_IDS}&key=${YT_API_KEY}" \
| jq -r '.items[] | [.snippet.publishedAt, .snippet.title, .statistics.viewCount] | @tsv'
videos.list returns video resources and can include public statistics such as view counts when you request the statisticspart.  
3) Is engagement healthy?
Use the same videos.list call, but print likes and comments too:
VIDEO_IDS=$(curl -s \
  "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=20&key=${YT_API_KEY}" \
 | jq -r '[.items[].contentDetails.videoId] | join(",")')

curl -s \
 "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${VIDEO_IDS}&key=${YT_API_KEY}" \
| jq -r '.items[] | [
.snippet.title,
.statistics.viewCount,
.statistics.likeCount,
.statistics.commentCount
] | @tsv'
If you want a quick public engagement ratio:
VIDEO_IDS=$(curl -s \
  "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=20&key=${YT_API_KEY}" \
 | jq -r '[.items[].contentDetails.videoId] | join(",")')

curl -s \
 "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${VIDEO_IDS}&key=${YT_API_KEY}" \
| jq -r '
.items[] |
. as $v |
  ($v.statistics.viewCount|tonumber) as $views |
  ($v.statistics.likeCount // "0"|tonumber) as $likes |
  ($v.statistics.commentCount // "0"|tonumber) as $comments |
  [
    $v.snippet.title,
    $views,
    $likes,
    $comments,
    (if $views > 0 then ((($likes + $comments) / $views) * 100) else 0 end)
  ] | @tsv'
This is still only public engagement, not retention or watch quality; those deeper metrics live in YouTube Analytics, not Data API.  
4) Is the channel active and consistent?
Get recent publish dates:
curl -s \
  "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=50&key=${YT_API_KEY}" \
| jq -r '.items[] | [.snippet.publishedAt, .snippet.title] | @tsv'
This lets you inspect:
how recently they posted
whether they post consistently
whether there are long gaps
You can also sort recent videos by date + views via videos.list:
VIDEO_IDS=$(curl -s \
  "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=20&key=${YT_API_KEY}" \
 | jq -r '[.items[].contentDetails.videoId] | join(",")')

curl -s \
 "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${VIDEO_IDS}&key=${YT_API_KEY}" \
| jq -r '.items[] | [.snippet.publishedAt, .snippet.title, .statistics.viewCount] | @tsv' \
| sort -r
playlistItems.list supports retrieving playlist contents, which is the right way to inspect a channel’s uploads cadence.  
5) Do comments suggest the right audience?
Pull top-level comment threads for a recent video:
curl -s \
 "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=VIDEO_ID_HERE&maxResults=50&order=relevance&textFormat=plainText&key=${YT_API_KEY}"
Cleaner output:
curl -s \
 "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=VIDEO_ID_HERE&maxResults=50&order=relevance&textFormat=plainText&key=${YT_API_KEY}" \
| jq -r '.items[] | [
.snippet.topLevelComment.snippet.authorDisplayName,
.snippet.topLevelComment.snippet.publishedAt,
.snippet.topLevelComment.snippet.textDisplay
] | @tsv'
If you want to do this on the most recent upload automatically:
LATEST_VIDEO_ID=$(curl -s \
  "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=1&key=${YT_API_KEY}" \
 | jq -r '.items[0].contentDetails.videoId')

curl -s \
 "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${LATEST_VIDEO_ID}&maxResults=50&order=relevance&textFormat=plainText&key=${YT_API_KEY}" \
| jq -r '.items[] | .snippet.topLevelComment.snippet.textDisplay'
commentThreads.list returns comment threads matching the request parameters and supports filtering by videoId.  
One end-to-end starter flow
This is the shortest useful sequence for @ashleyrosepeters:

# 1. Recent uploads

curl -s \
 "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=10&key=${YT_API_KEY}"

# 2. Extract video IDs

VIDEO_IDS=$(curl -s \
  "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=UUzwPKK7dTlO2W21g122MNkQ&maxResults=10&key=${YT_API_KEY}" \
 | jq -r '[.items[].contentDetails.videoId] | join(",")')

# 3. Get public stats + titles

curl -s \
 "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${VIDEO_IDS}&key=${YT_API_KEY}"

# 4. Inspect comments on newest video

LATEST_VIDEO_ID=$(echo "${VIDEO_IDS}" | cut -d',' -f1)

curl -s \
 "https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${LATEST_VIDEO_ID}&maxResults=50&order=relevance&textFormat=plainText&key=${YT_API_KEY}"
What each call answers
channels.list → who the creator is, headline metadata
playlistItems.list → what they posted recently
videos.list → whether recent videos get views / likes / comments
commentThreads.list → whether commenters look like your target audience  
If you want, I can turn these into one Bash script that outputs a compact creator-fit report for this exact channel.
