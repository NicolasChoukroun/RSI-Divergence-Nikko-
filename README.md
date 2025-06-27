# RSI-Divergence-Nikko-
RSI Divergence by Nikko

🧠 RSI Divergence Detector — Nikko Edition
This script is an enhanced RSI Divergence detector built with Pine Script v6, modified for better visuals and practical usability. It uses linear regression to detect bullish and bearish divergences between the RSI and price action — one of the most reliable early signals in technical analysis.

✅ Improvements from the Original:
- Clean divergence lines using regression fitting.
- Optional label display to reduce clutter (Display Labels toggle).
- Adjustable line thickness (Display Line Width).
- A subtle heatmap background to highlight RSI overbought/oversold zones.
- Uses max accuracy with high calc_bars_count and custom extrapolation window.

🔍 How It Works:
The script applies linear regression (least squares method) on both:

RSI data, and Price (close) data.

It then compares the direction of RSI vs. direction of Price over a set length.
If price is making higher highs while RSI makes lower highs, it's a bearish divergence.
If price is making lower lows while RSI makes higher lows, it's a bullish divergence.
Additional filters (e.g., momentum and slope thresholds) are used to validate only strong divergences.

🔧 Input Parameters:
RSI Length: The RSI period (default: 14).
RSI Divergence Length: The lookback period for regression (default: 25).
Source: Which price data to calculate RSI from (default: close).
Display Labels: Show/hide “Bullish” or “Bearish” labels on the chart.
Display Line Width: Adjusts how thick the plotted divergence lines appear.

📣 Alerts:
Alerts are built-in for both RSI Buy (bullish divergence) and RSI Sell (bearish divergence) so you can use it in automation or notifications.

🚀 Personal Note:
I’ve been using this script daily in my own trading, which is why I took time to improve both the logic and visual clarity. If you want a divergence tool that doesn't clutter your chart but gives strong signals, this might be what you're looking for.
