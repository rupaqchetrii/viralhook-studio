"""
ViralHook Studio - Production ML Pipeline Definition
Lead: Tanvir (Machine Learning & NLP Lead)

Contains PureTfidfLogisticPipeline so it is cleanly serializable/deserializable
by joblib across training scripts, API servers, and test runners.
"""

import math
import re
from collections import Counter


class PureTfidfLogisticPipeline:
    """
    Self-contained, production-grade TF-IDF + Multinomial Logistic Regression Pipeline.
    Implements standard fit, predict, and predict_proba interfaces compatible with scikit-learn.
    Operates with zero external compiled C-extensions, ensuring maximum portability.
    """

    def __init__(self, ngram_range=(1, 2), min_df=2, max_features=3000, lr=0.1, max_iter=150):
        self.ngram_range = ngram_range
        self.min_df = min_df
        self.max_features = max_features
        self.lr = lr
        self.max_iter = max_iter
        self.classes_ = ["Low", "Medium", "High"]
        self.vocab = {}  # term -> index
        self.idf = {}    # index -> idf weight
        self.weights = []  # shape: (n_classes, n_features + 1)
        self.fitted = False

    def _tokenize(self, text: str):
        text = text.lower().strip()
        tokens = re.findall(r"\b[a-z0-9_']+\b", text)
        ngrams = list(tokens)
        if self.ngram_range[1] >= 2:
            for i in range(len(tokens) - 1):
                ngrams.append(f"{tokens[i]}_{tokens[i+1]}")
        return ngrams

    def fit(self, texts, labels):
        import random
        n_samples = len(texts)
        tokenized_docs = [self._tokenize(t) for t in texts]

        # 1. Document Frequencies
        df_counts = Counter()
        for doc in tokenized_docs:
            unique_terms = set(doc)
            df_counts.update(unique_terms)

        filtered_terms = [
            term for term, count in df_counts.items()
            if count >= self.min_df
        ]
        filtered_terms.sort(key=lambda t: df_counts[t], reverse=True)
        filtered_terms = filtered_terms[:self.max_features]

        self.vocab = {term: idx for idx, term in enumerate(filtered_terms)}
        n_features = len(self.vocab)

        # 2. IDF: log((1 + n_samples) / (1 + df)) + 1
        self.idf = {}
        for term, idx in self.vocab.items():
            df = df_counts[term]
            self.idf[idx] = math.log((1.0 + n_samples) / (1.0 + df)) + 1.0

        # 3. Sparse TF-IDF vectors
        X = [self._transform_single(doc) for doc in tokenized_docs]
        y_indices = [self.classes_.index(lbl) for lbl in labels]

        # 4. Multinomial Logistic Regression via Mini-Batch Gradient Descent
        n_classes = len(self.classes_)
        self.weights = [[0.0] * (n_features + 1) for _ in range(n_classes)]

        class_counts = Counter(y_indices)
        class_weights = [n_samples / (n_classes * class_counts[c]) for c in range(n_classes)]

        m = [[0.0] * (n_features + 1) for _ in range(n_classes)]
        v = [[0.0] * (n_features + 1) for _ in range(n_classes)]
        beta1, beta2, eps = 0.9, 0.999, 1e-8

        batch_size = 64
        indices = list(range(n_samples))

        for iteration in range(1, self.max_iter + 1):
            random.shuffle(indices)
            for b_start in range(0, n_samples, batch_size):
                b_idx = indices[b_start:b_start + batch_size]
                grads = [[0.0] * (n_features + 1) for _ in range(n_classes)]

                for i in b_idx:
                    feats = X[i]
                    target = y_indices[i]
                    w_sample = class_weights[target]

                    logits = [0.0] * n_classes
                    for c in range(n_classes):
                        score = self.weights[c][-1]
                        for f_idx, f_val in feats:
                            score += self.weights[c][f_idx] * f_val
                        logits[c] = score

                    max_logit = max(logits)
                    exp_scores = [math.exp(l - max_logit) for l in logits]
                    sum_exp = sum(exp_scores)
                    probs = [s / sum_exp for s in exp_scores]

                    for c in range(n_classes):
                        err = (probs[c] - (1.0 if c == target else 0.0)) * w_sample
                        for f_idx, f_val in feats:
                            grads[c][f_idx] += err * f_val
                        grads[c][-1] += err

                l2_reg = 0.001
                b_len = len(b_idx)
                for c in range(n_classes):
                    for f_idx in range(n_features + 1):
                        g = (grads[c][f_idx] / b_len) + (l2_reg * self.weights[c][f_idx] if f_idx < n_features else 0)
                        m[c][f_idx] = beta1 * m[c][f_idx] + (1 - beta1) * g
                        v[c][f_idx] = beta2 * v[c][f_idx] + (1 - beta2) * (g * g)

                        m_hat = m[c][f_idx] / (1.0 - beta1 ** iteration)
                        v_hat = v[c][f_idx] / (1.0 - beta2 ** iteration)
                        self.weights[c][f_idx] -= (self.lr / (math.sqrt(v_hat) + eps)) * m_hat

        self.fitted = True
        return self

    def _transform_single(self, doc_tokens):
        tf = Counter(doc_tokens)
        sparse_vec = []
        squared_sum = 0.0

        for term, count in tf.items():
            if term in self.vocab:
                idx = self.vocab[term]
                val = (1.0 + math.log(count)) * self.idf[idx]
                sparse_vec.append((idx, val))
                squared_sum += val * val

        norm = math.sqrt(squared_sum) if squared_sum > 0 else 1.0
        return [(idx, val / norm) for idx, val in sparse_vec]

    def predict_proba(self, texts):
        results = []
        n_classes = len(self.classes_)

        for text in texts:
            tokens = self._tokenize(text)
            feats = self._transform_single(tokens)

            logits = [0.0] * n_classes
            for c in range(n_classes):
                score = self.weights[c][-1]
                for f_idx, f_val in feats:
                    score += self.weights[c][f_idx] * f_val
                logits[c] = score

            max_logit = max(logits)
            exp_scores = [math.exp(l - max_logit) for l in logits]
            sum_exp = sum(exp_scores) or 1.0
            probs = [round(s / sum_exp, 4) for s in exp_scores]
            results.append(probs)

        return results

    def predict(self, texts):
        probs_list = self.predict_proba(texts)
        return [self.classes_[probs.index(max(probs))] for probs in probs_list]
