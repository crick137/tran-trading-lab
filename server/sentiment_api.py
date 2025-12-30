"""
FinBERT Sentiment Analysis API
金融情绪分析 API 服务

运行方式:
    pip install -r requirements.txt
    python sentiment_api.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# 模型加载状态
model = None
tokenizer = None
model_loaded = False

def load_model():
    """懒加载 FinBERT 模型"""
    global model, tokenizer, model_loaded
    if model_loaded:
        return True
    
    try:
        print("📦 Loading FinBERT model (this may take 1-2 minutes on first run)...")
        from transformers import AutoModelForSequenceClassification, AutoTokenizer
        import torch
        
        model = AutoModelForSequenceClassification.from_pretrained('ProsusAI/finbert')
        tokenizer = AutoTokenizer.from_pretrained('ProsusAI/finbert')
        model_loaded = True
        print("✅ FinBERT model loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return False

@app.route('/api/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model_loaded,
        'service': 'FinBERT Sentiment API'
    })

@app.route('/api/sentiment', methods=['POST'])
def analyze_sentiment():
    """
    分析文本情绪
    
    请求体:
        { "texts": ["text1", "text2", ...] }
    
    响应:
        [{ "text": "...", "sentiment": "positive/negative/neutral", "confidence": 0.95, "scores": {...} }]
    """
    import torch
    
    if not load_model():
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.json
    texts = data.get('texts', [])
    
    if not texts:
        return jsonify({'error': 'No texts provided'}), 400
    
    # 限制单次请求数量
    if len(texts) > 50:
        return jsonify({'error': 'Max 50 texts per request'}), 400
    
    results = []
    labels = ['positive', 'negative', 'neutral']
    
    for text in texts:
        try:
            # 分词
            inputs = tokenizer(
                text, 
                return_tensors="pt", 
                truncation=True, 
                max_length=512,
                padding=True
            )
            
            # 推理
            with torch.no_grad():
                outputs = model(**inputs)
                probs = torch.softmax(outputs.logits, dim=-1)[0]
            
            # 获取结果
            scores = {labels[i]: round(probs[i].item(), 4) for i in range(3)}
            max_idx = probs.argmax().item()
            
            results.append({
                'text': text[:100] + '...' if len(text) > 100 else text,
                'sentiment': labels[max_idx],
                'confidence': round(probs[max_idx].item(), 4),
                'scores': scores
            })
        except Exception as e:
            results.append({
                'text': text[:50] + '...',
                'sentiment': 'error',
                'error': str(e)
            })
    
    return jsonify(results)

@app.route('/api/sentiment/batch', methods=['POST'])
def analyze_batch():
    """
    批量分析新闻情绪统计
    返回整体情绪分布
    """
    import torch
    
    if not load_model():
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.json
    texts = data.get('texts', [])
    
    if not texts:
        return jsonify({'error': 'No texts provided'}), 400
    
    sentiment_counts = {'positive': 0, 'negative': 0, 'neutral': 0}
    labels = ['positive', 'negative', 'neutral']
    
    for text in texts:
        try:
            inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            with torch.no_grad():
                outputs = model(**inputs)
                probs = torch.softmax(outputs.logits, dim=-1)[0]
            sentiment = labels[probs.argmax().item()]
            sentiment_counts[sentiment] += 1
        except:
            pass
    
    total = sum(sentiment_counts.values())
    
    return jsonify({
        'total_analyzed': total,
        'counts': sentiment_counts,
        'percentages': {
            k: round(v / total * 100, 1) if total > 0 else 0 
            for k, v in sentiment_counts.items()
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('SENTIMENT_PORT', 5000))
    print(f"""
╔══════════════════════════════════════════════════════╗
║      🧠 FinBERT Sentiment Analysis API               ║
╠══════════════════════════════════════════════════════╣
║  Server running at http://localhost:{port}             ║
╠══════════════════════════════════════════════════════╣
║  📊 Endpoints:                                       ║
║     GET  /api/health          - Health Check         ║
║     POST /api/sentiment       - Analyze Texts        ║
║     POST /api/sentiment/batch - Batch Statistics     ║
╚══════════════════════════════════════════════════════╝
    """)
    
    # 预加载模型
    load_model()
    
    app.run(host='0.0.0.0', port=port, debug=False)
