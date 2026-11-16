# Dataset Specification & Data Provenance

## Tri-Modal Data Hierarchy

To eliminate the "Caption vs. Hook Transcript" illusion, ViralHook Studio organizes data into three distinct tiers with mandatory provenance tagging:

| Tier | Name | Target Size | Modality | Primary Use |
|---|---|---|---|---|
| **Tier 1 (Gold)** | Spoken Hook Benchmark | 2,500 samples | Audio Transcripts ($t \in [0, 5\text{s}]$) via Whisper | Ground truth model training & evaluation |
| **Tier 2 (Platinum)**| Viral Archetype Corpus | 500 samples | Verified High-Performing Opening Lines | Rule-linter and archetype classification |
| **Tier 3 (Silver)** | Social Metadata Dataset | 10,000+ samples | Post Captions & Tags (Kaggle) | Niche terminology priors & baseline comparison |

---

## Data Schema & Dictionary

| Field | Type | Description | Required? |
|---|---|---|:---:|
| `record_id` | string (UUID) | Unique record identifier | Yes |
| `platform` | enum | `tiktok`, `reels`, `shorts` | Yes |
| `modality` | enum | `spoken_audio_transcript`, `on_screen_text`, `post_caption` | Yes |
| `hook_text` | string | Exact opening text (first 1–5 seconds) | Yes |
| `caption_text` | string | Accompanying post caption/description | No |
| `creator_id_hash` | string | Pseudonymized creator identifier for group splitting | Yes |
| `published_at` | datetime | UTC timestamp of publication | Yes |
| `niche` | enum | `tech_code`, `business_finance`, `fitness_health`, `education`, `lifestyle` | Yes |
| `views` | integer | Total view count at capture time | Yes |
| `likes` | integer | Total likes | Yes |
| `comments` | integer | Total comments | Yes |
| `shares` | integer | Total shares | Yes |
| `saves` | integer | Total saves / bookmarks | Yes |
| `creator_median_views` | integer | Median view count of creator's last 10 posts | Preferred |
| `fnvm_class` | enum | Derived target: `low`, `medium`, `high` | Derived |

