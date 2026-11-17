"""Quick gateway verification script."""
import sys
sys.path.insert(0, ".")

from backend.app.services.prediction_gateway import PredictionGateway

gw = PredictionGateway()
print("Model loaded:", gw.is_loaded)
print("Model type:", gw.metadata.get("model_type", "N/A"))
print("CV Macro-F1:", gw.metadata.get("cv_macro_f1_mean", "N/A"))
print("Inference mode:", "trained_model" if gw.is_loaded else "heuristic_fallback")
print()

tests = [
    ("You are making 5 Python mistakes destroying your code quality", "High"),
    ("Stop doing this — it will ruin your channel growth forever", "High"),
    ("5 tips to improve your morning routine this week", "Medium"),
    ("Hey guys welcome back to my channel today", "Low"),
    ("In this video I will show you how to code", "Low"),
    # Edge cases
    ("", None),
    ("🔥🔥🔥", None),
    ("a", None),
    ("You" * 50, None),  # very long
]

print("GATEWAY PREDICTIONS:")
print("-" * 70)
for text, expected in tests:
    try:
        cls, probs, mock = gw.predict_hook(text if text else "ok")
        ph = probs.get("High", 0)
        pm = probs.get("Medium", 0)
        pl = probs.get("Low", 0)
        total = round(ph + pm + pl, 3)
        status = "OK" if expected is None else ("PASS" if cls == expected else "WARN")
        print(f"  [{status}] predicted={cls} | H={ph:.2f} M={pm:.2f} L={pl:.2f} sum={total}")
        label = text[:60] + "..." if len(text) > 60 else text
        print(f"       hook: '{label}'")
    except Exception as e:
        print(f"  [EDGE] hook='{text[:40]}' -> ERROR: {e}")
print()
print("All gateway checks complete.")
