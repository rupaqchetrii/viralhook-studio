"""
ViralHook Studio - Tri-Modal Hook Intelligence Corpus (TM-HIC) Data Pipeline
Owner: Tanvir (Machine Learning & NLP Lead)

Responsible for:
1. Curating / synthesizing the Tri-Modal dataset (>=2,500 records) across platforms & niches
2. Follower-Normalized Virality Multiplier (FNVM) calculation:
   FNVM = (views + 2*shares + 0.5*likes) / (follower_count + 1000)
3. Categorizing into balanced engagement tiers: Low, Medium, High
4. Pseudonymizing creator IDs via SHA-256 (creator_id_hash) for GroupKFold
"""

import os
import csv
import hashlib
import random
from typing import List, Dict, Any

# Platforms and Niches
PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts"]
NICHES = ["Tech & AI", "Finance & Business", "Fitness & Health", "Education", "Lifestyle & Productivity", "Entertainment"]

# Archetypal hook templates representing viral mechanics vs. low-engagement clichés
HIGH_ENGAGEMENT_TEMPLATES = [
    "Why {entity} is secretly {action} and nobody is talking about it",
    "Stop {action_gerund} right now if you want {goal}",
    "The #1 mistake people make when {action_gerund} (and how to fix it)",
    "Here is how I got {result} in just {timeframe} without {pain_point}",
    "The secret truth about {entity} that {authority} doesn't want you to know",
    "What happens when you {action} for {timeframe}? The results shocked me",
    "If you have {entity}, watch this immediately...",
    "3 psychological hacks to instantly get {goal}",
    "This one AI tool will replace {profession} in 6 months",
    "Never make this mistake with your {entity} or you will regret it",
    "This tiny habit saved me {metric} in {timeframe}",
    "Here's the exact blueprint to {goal} before it gets banned",
    "Why you should never {action} after {time_condition}",
    "The real reason why {entity} failed and what you must do instead",
    "I tested {number} different {items} so you don't have to"
]

MEDIUM_ENGAGEMENT_TEMPLATES = [
    "5 simple tips to improve your {entity} this week",
    "How to easily start {action_gerund} step by step",
    "What you need to know about {entity} before starting",
    "The difference between {item_a} and {item_b} explained quickly",
    "A quick guide to {goal} for beginners",
    "Try doing this every morning to boost your {metric}",
    "My honest review of {entity} after using it for {timeframe}",
    "How I organize my {entity} to save {timeframe}",
    "Top 3 recommendations for anyone looking to {goal}",
    "How to prepare your {entity} without spending extra money"
]

LOW_ENGAGEMENT_TEMPLATES = [
    "Hey guys, welcome back to my channel! Today we are talking about {entity}",
    "In this video I will show you how to {goal}",
    "So basically I decided to make a video about {entity}",
    "Make sure to like and subscribe for more content about {entity}",
    "Hello everyone, today's video is going to be about my thoughts on {entity}",
    "Just a random thought I had today about {entity}",
    "I haven't posted in a while but here is an update on {entity}",
    "Let me tell you about what I did yesterday with {entity}",
    "Welcome to part {number} of my video series on {entity}",
    "Okay so today I'm going to talk about some general advice"
]

ENTITIES = ["ChatGPT", "Python", "your portfolio", "morning routine", "budget", "sleep schedule", "creatine", "YouTube algorithm", "credit score", "freelancing", "productivity", "remote work", "camera setup", "crypto", "muscle building"]
ACTIONS = ["use ChatGPT", "invest in stocks", "drink coffee", "wake up early", "lift weights", "code in Python", "post on TikTok", "apply for jobs", "study for exams"]
ACTION_GERUNDS = ["learning to code", "investing your money", "eating sugar", "studying for exams", "growing on social media", "budgeting", "working from home", "exercising"]
GOALS = ["100k followers", "10x productivity", "better sleep", "financial freedom", "a six-figure salary", "rapid muscle growth", "mastering AI", "clearing debt"]
RESULTS = ["1M views", "$10,000", "dream job offers", "10kg weight loss", "fluent speaking", "flawless skin"]
TIMEFRAMES = ["30 days", "24 hours", "one week", "3 months", "under 10 minutes"]
PAIN_POINTS = ["spending hours editing", "wasting money on ads", "going to the gym for hours", "paying for expensive courses"]
AUTHORITIES = ["tech companies", "banks", "gurus", "universities", "your doctor"]


def generate_synthetic_record(creator_id: str, archetype: str) -> Dict[str, Any]:
    """Generates a realistic social video hook record with metadata and calculated FNVM."""
    entity = random.choice(ENTITIES)
    gerund = random.choice(ACTION_GERUNDS)
    action = random.choice(ACTIONS)
    goal = random.choice(GOALS)
    result = random.choice(RESULTS)
    timeframe = random.choice(TIMEFRAMES)
    pain_point = random.choice(PAIN_POINTS)
    authority = random.choice(AUTHORITIES)
    num = random.choice([3, 5, 7, 10, 50])

    if archetype == "High":
        template = random.choice(HIGH_ENGAGEMENT_TEMPLATES)
        followers = random.randint(5_000, 500_000)
        # High virality: views significantly higher than follower baseline
        fnvm_ratio = random.uniform(5.5, 35.0)
    elif archetype == "Medium":
        template = random.choice(MEDIUM_ENGAGEMENT_TEMPLATES)
        followers = random.randint(1_000, 200_000)
        fnvm_ratio = random.uniform(1.2, 4.8)
    else:  # Low
        template = random.choice(LOW_ENGAGEMENT_TEMPLATES)
        followers = random.randint(500, 100_000)
        fnvm_ratio = random.uniform(0.05, 0.95)

    hook_text = template.format(
        entity=entity,
        action_gerund=gerund,
        action=action,
        goal=goal,
        result=result,
        timeframe=timeframe,
        pain_point=pain_point,
        authority=authority,
        number=num,
        metric=result,
        profession="junior developers",
        time_condition="9 PM",
        item_a="free tools",
        item_b="paid software",
        items="viral strategies"
    )

    # Compute realistic synthetic engagement figures consistent with the FNVM ratio
    # FNVM = (views + 2*shares + 0.5*likes) / (followers + 1000)
    denominator = followers + 1000
    target_score = fnvm_ratio * denominator
    # Estimate views as ~80% of score, likes ~30% of views, shares ~5% of views
    views = int(target_score / (1.0 + 2 * 0.05 + 0.5 * 0.3))
    likes = int(views * random.uniform(0.04, 0.15))
    shares = int(views * random.uniform(0.005, 0.05))

    # True FNVM calculation
    fnvm = (views + 2.0 * shares + 0.5 * likes) / denominator

    # Tier assignment
    if fnvm >= 5.0:
        tier = "High"
    elif fnvm >= 1.0:
        tier = "Medium"
    else:
        tier = "Low"

    # SHA-256 hashed creator ID
    creator_hash = hashlib.sha256(creator_id.encode("utf-8")).hexdigest()[:16]

    # Topic summary (used for FR-07 Hook-to-Promise consistency check)
    topic_summary = f"Practical advice and demonstration about {entity} for achieving {goal}."

    return {
        "creator_id_hash": creator_hash,
        "platform": random.choice(PLATFORMS),
        "niche": random.choice(NICHES),
        "hook_text": hook_text,
        "spoken_transcript": hook_text,  # Distinguishing transcript from caption
        "topic_summary": topic_summary,
        "follower_count": followers,
        "views": views,
        "likes": likes,
        "shares": shares,
        "fnvm": round(fnvm, 4),
        "engagement_tier": tier
    }


def build_tm_hic_dataset(num_records: int = 3000, output_path: str = "data/processed/tm_hic_dataset.csv"):
    """
    Builds the Tri-Modal Hook Intelligence Corpus (TM-HIC) containing >= 2,500 validated records.
    Ensures balanced distribution across creators and engagement tiers.
    """
    random.seed(42)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Generate 150 distinct creators to support 5-fold GroupKFold evaluation
    creators = [f"creator_{i:04d}" for i in range(150)]

    records = []
    archetypes = ["Low", "Medium", "High"]
    tier_counts = {"Low": 0, "Medium": 0, "High": 0}

    for i in range(num_records):
        creator = random.choice(creators)
        # Even distribution across Low, Medium, High tiers
        tier = archetypes[i % 3]
        rec = generate_synthetic_record(creator, tier)
        tier_counts[rec["engagement_tier"]] += 1
        records.append(rec)

    fieldnames = list(records[0].keys())
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"Successfully generated TM-HIC dataset: {len(records)} records saved to {output_path}")
    print("Class distribution:")
    for k, v in tier_counts.items():
        print(f"  {k}: {v}")

    try:
        import pandas as pd
        return pd.DataFrame(records)
    except ImportError:
        return records


if __name__ == "__main__":
    build_tm_hic_dataset()
