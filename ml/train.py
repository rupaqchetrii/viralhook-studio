"""
ViralHook Studio - TF-IDF + Multinomial Logistic Regression Model Training
Owner: Tanvir (Machine Learning & NLP Lead)

Responsible for:
1. Loading the 3,000-record TM-HIC dataset (data/processed/tm_hic_dataset.csv)
2. Performing GroupKFold / creator-grouped split to prevent creator leakage
3. Fitting TF-IDF vectorizer (unigrams + bigrams)
4. Training a Multinomial Logistic Regression classifier (3 classes: Low, Medium, High)
5. Computing validation metrics: Macro-F1, per-class precision/recall, confusion matrix
6. Persisting model_pipeline.joblib and model_metadata.json for the FastAPI backend
"""

import os
import csv
import json
import math
import random
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
import joblib


from ml.pipeline import PureTfidfLogisticPipeline


def evaluate_model(y_true, y_pred, classes):
    """Computes Macro-F1, per-class metrics and confusion matrix."""
    n_classes = len(classes)
    matrix = {c_true: {c_pred: 0 for c_pred in classes} for c_true in classes}
    for yt, yp in zip(y_true, y_pred):
        matrix[yt][yp] += 1

    per_class = {}
    f1_scores = []

    for c in classes:
        tp = matrix[c][c]
        fp = sum(matrix[other][c] for other in classes if other != c)
        fn = sum(matrix[c][other] for other in classes if other != c)

        precision = round(tp / (tp + fp), 4) if (tp + fp) > 0 else 0.0
        recall = round(tp / (tp + fn), 4) if (tp + fn) > 0 else 0.0
        f1 = round(2 * precision * recall / (precision + recall), 4) if (precision + recall) > 0 else 0.0

        per_class[c] = {
            "precision": precision,
            "recall": recall,
            "f1_score": f1,
            "support": tp + fn,
        }
        f1_scores.append(f1)

    macro_f1 = round(sum(f1_scores) / n_classes, 4)
    accuracy = round(sum(matrix[c][c] for c in classes) / len(y_true), 4)

    return {
        "accuracy": accuracy,
        "macro_f1": macro_f1,
        "per_class": per_class,
        "confusion_matrix": matrix,
    }


def main():
    print("==================================================================")
    print("ViralHook Studio - TF-IDF + Multinomial Logistic Regression")
    print("Lead: Tanvir | Dataset: TM-HIC (3,000 records)")
    print("==================================================================")

    dataset_path = os.path.join("data", "processed", "tm_hic_dataset.csv")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")

    # 1. Load Dataset
    records = []
    with open(dataset_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)

    print(f"Loaded {len(records)} verified records from {dataset_path}")

    # 2. Creator Group Split (prevent data leakage across train and test)
    creator_ids = list({r["creator_id_hash"] for r in records})
    random.seed(42)
    random.shuffle(creator_ids)
    test_creators = set(creator_ids[: int(len(creator_ids) * 0.2)])

    train_data = [r for r in records if r["creator_id_hash"] not in test_creators]
    test_data = [r for r in records if r["creator_id_hash"] in test_creators]

    print(f"Grouped Split: {len(train_data)} train samples, {len(test_data)} test samples.")

    X_train = [r["hook_text"] for r in train_data]
    y_train = [r["engagement_tier"] for r in train_data]

    X_test = [r["hook_text"] for r in test_data]
    y_test = [r["engagement_tier"] for r in test_data]

    # 3. Train Pipeline
    print("Training TF-IDF + Multinomial Logistic Regression Pipeline...")
    pipeline = PureTfidfLogisticPipeline(ngram_range=(1, 2), min_df=2, max_features=3000, lr=0.1, max_iter=150)
    pipeline.fit(X_train, y_train)

    # 4. Evaluation on Test Set
    y_pred = pipeline.predict(X_test)
    eval_results = evaluate_model(y_test, y_pred, pipeline.classes_)

    print("\n--- MODEL EVALUATION REPORT ---")
    print(f"Test Accuracy:  {eval_results['accuracy']:.2%}")
    print(f"Test Macro-F1:  {eval_results['macro_f1']:.4f}")
    for c, metrics in eval_results["per_class"].items():
        print(f"  Class [{c:6s}]: Precision={metrics['precision']:.3f}, Recall={metrics['recall']:.3f}, F1={metrics['f1_score']:.3f} (N={metrics['support']})")

    # 5. Export Pipeline and Metadata
    output_dir = os.path.join("backend", "models")
    os.makedirs(output_dir, exist_ok=True)

    model_path = os.path.join(output_dir, "model_pipeline.joblib")
    joblib.dump(pipeline, model_path)
    print(f"\nModel pipeline successfully saved to {model_path}")

    metadata = {
        "model_name": "TF-IDF + Multinomial Logistic Regression",
        "version": "1.0.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset": "TM-HIC (Tri-Modal Hook Intelligence Corpus)",
        "sample_size": len(records),
        "train_samples": len(train_data),
        "test_samples": len(test_data),
        "classes": pipeline.classes_,
        "vocabulary_size": len(pipeline.vocab),
        "metrics": eval_results,
        "parameters": {
            "ngram_range": [1, 2],
            "min_df": 2,
            "max_features": 3000,
            "close_result_margin": 0.08,
        },
        "disclaimer": (
            "Model probabilities reflect text-based statistical association in the training dataset. "
            "They do not constitute a guarantee of video virality or algorithmic promotion."
        ),
    }

    meta_path = os.path.join(output_dir, "model_metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Model metadata successfully saved to {meta_path}")

    # 6. Verification Test
    print("\n--- SANITY INFERENCE CHECK ---")
    sample_hooks = [
        "Stop making this #1 coding mistake right now if you want to get hired!",
        "Hey guys, welcome back to my channel! Today we are talking about Python.",
        "5 simple tips to improve your sleep schedule this week"
    ]
    sample_probs = pipeline.predict_proba(sample_hooks)
    for hook, probs in zip(sample_hooks, sample_probs):
        pred_cls = pipeline.classes_[probs.index(max(probs))]
        prob_str = ", ".join(f"{c}: {p:.1%}" for c, p in zip(pipeline.classes_, probs))
        print(f"Hook: '{hook}'\n  -> Predicted: {pred_cls} ({prob_str})\n")


if __name__ == "__main__":
    main()
