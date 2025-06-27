// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// modified by Nikko June 2025

//@version=6
indicator('RSI Divergence (Nikko)', overlay = false, max_lines_count = 500, calc_bars_count = 5000)

// Ensure sufficient historical data
max_bars_back(time,500)

// === INPUT PARAMETERS ===
rsilen = input.int(14, title = 'rsi length')
rsisrc = input(close, title = 'source')
x = ta.rsi(rsisrc, rsilen) // RSI calculation

// Display options
displaylabels = input.bool( title = 'Display Labels', defval = true)
len = input.int(25, title = 'RSI Divergence length', maxval = 5000)
linewidth = input.int( title = 'Display Line Width', defval = 2)
src = close
extrapolation = 0

// === LINEAR REGRESSION FOR RSI ===
xo = 0.0 // x average sum
yo = 0.0 // y (RSI) average sum
xyo = 0.0 // x*y cross-product sum
xxo = 0.0 // x*x sum
for i = 0 to len - 1 by 1
    xo := xo + i / len
    yo := yo + x[len - 1 - i] / len
    xyo := xyo + i * x[len - 1 - i] / len
    xxo := xxo + i * i / len
    xxo

// Store lowest low for reference
lowBound = ta.lowest(low, 200)

// Create RSI trend line values
rsiFitArray = array.new_float(len * 2 + 1 + extrapolation)
rsiLineArray = array.new_line()
a = (xo * yo - xyo) / (xo * xo - xxo)
b = yo - a * xo
for i = 0 to len - 1 + extrapolation by 1
    array.set(rsiFitArray, i, a * i + b)

//// === LINEAR REGRESSION FOR PRICE ===
mo = 0.0 // Average volatility
xo2 = 0.0
yo2 = 0.0
xyo2 = 0.0
xxo2 = 0.0
for i = 0 to len - 1 by 1
    mo := mo + (high[len - 1 - i]-low[len - 1 - i]) / len
    xo2 := xo2 + i / len
    yo2 := yo2 + src[len - 1 - i] / len
    xyo2 := xyo2 + i * src[len - 1 - i] / len
    xxo2 := xxo2 + i * i / len
    xxo2

priceFitArray = array.new_float(len * 2 + 1 + extrapolation)
priceLineArray = array.new_line()
a2 = (xo2 * yo2 - xyo2) / (xo2 * xo2 - xxo2)
b2 = yo2 - a * xo2
for i = 0 to len - 1 + extrapolation by 1
    array.set(priceFitArray, i, a2 * i + b2)

// === DIVERGENCE CHECK ===
ttk = array.get(rsiFitArray, 0) < array.get(rsiFitArray, 1) and array.get(priceFitArray, 0) > array.get(priceFitArray, 1) ? 1 : array.get(rsiFitArray, 0) > array.get(rsiFitArray, 1) and array.get(priceFitArray, 0) < array.get(priceFitArray, 1) ? -1 : 0

// Check for bullish and bearish divergence conditions
cg = array.get(rsiFitArray, 0) < array.get(rsiFitArray, 1) and array.get(priceFitArray, 0) > array.get(priceFitArray, 1)
cr = array.get(rsiFitArray, 0) > array.get(rsiFitArray, 1) and array.get(priceFitArray, 0) < array.get(priceFitArray, 1)

// Confirm strength of divergence
cr := cr and  array.get(priceFitArray, 0) - array.get(priceFitArray, 24) < -mo and array.get(rsiFitArray, 0) - array.get(rsiFitArray, 24) > 5
cg := cg and array.get(priceFitArray, 0) - array.get(priceFitArray, 24) > mo and array.get(rsiFitArray, 0) - array.get(rsiFitArray, 24) < -5

// === RSI PLOT ===
plotcolor=color.rgb(200, 200, 200,10)
if (x>=80)
    plotcolor:=color.rgb(255, 000, 100,0)
if (x<=30)
    plotcolor:=color.rgb(100, 255, 0,10)

if x<80 and x>30
    plotcolor:=color.rgb(200, 200, 200,10)

plot(x, color = plotcolor)    


// === SECOND REGRESSION LINES FOR PLOTTING ===
// These capture the detected divergences visually with updated trend lines
// Bullish
xo3 = 0.0
yo3 = 0.0
xyo3 = 0.0
xxo3 = 0.0
for i = 0 to len - 1 by 1
    xo3 := xo3 + i / len
    yo3 := yo3 + x[len - 1 - i + ta.barssince(cg)] / len
    xyo3 := xyo3 + i * x[len - 1 - i + ta.barssince(cg)] / len
    xxo3 := xxo3 + i * i / len
    xxo3

dizi3 = array.new_float(len * 2 + 1 + extrapolation)
linedizi3 = array.new_line()
a3 = (xo3 * yo3 - xyo3) / (xo3 * xo3 - xxo3)
b3 = yo3 - a3 * xo3
for i = 0 to len - 1 + extrapolation by 1
    array.set(dizi3, i, a3 * i + b3)

// Bearish
xo4 = 0.0
yo4 = 0.0
xyo4 = 0.0
xxo4 = 0.0
for i = 0 to len - 1 by 1
    xo4 := xo4 + i / len
    yo4 := yo4 + x[len - 1 - i + ta.barssince(cr)] / len
    xyo4 := xyo4 + i * x[len - 1 - i + ta.barssince(cr)] / len
    xxo4 := xxo4 + i * i / len
    xxo4

dizi4 = array.new_float(len * 2 + 1 + extrapolation)
linedizi4 = array.new_line()
a4 = (xo4 * yo4 - xyo4) / (xo4 * xo4 - xxo4)
b4 = yo4 - a4 * xo4
for i = 0 to len - 1 + extrapolation by 1
    array.set(dizi4, i, a4 * i + b4)

// Prevent repeated signals in the same window
for i = 0 to len-1
    cg:= cg and not cg[i+1]
    cr:= cr and not cr[i+1]

// === DRAW SIGNALS AND ALERTS ===
if cg
    line.new(ta.valuewhen(cg, bar_index, 0) - len +1, ta.valuewhen(cg, array.get(dizi3, 0), 0), ta.valuewhen(cg, bar_index, 0), ta.valuewhen(cg, array.get(dizi3, len - 1), 0), color = color.rgb(0, 255, 0), width = linewidth)
    alert("Positive \nDivergence", alert.freq_once_per_bar_close)
    if displaylabels
        label.new(bar_index,close, "Bullish", xloc.bar_index, yloc.belowbar, color.rgb(0, 87, 3), label.style_label_up, color.rgb(255, 255, 255), size.normal, text.align_center, na, font.family_default, true)    

if cr 
    line.new(ta.valuewhen(cr, bar_index, 0) - len +1, ta.valuewhen(cr, array.get(dizi4, 0), 0), ta.valuewhen(cr, bar_index, 0), ta.valuewhen(cr, array.get(dizi4, len - 1), 0), color = color.rgb(255, 0, 0, 0), width = linewidth)
    alert("Negative \nDivergence", alert.freq_once_per_bar_close)    
    if displaylabels 
        label.new(bar_index,close, "Bearish", xloc.bar_index, yloc.abovebar, color.rgb(102, 0, 0), label.style_label_down, color.white, size.normal, text.align_center, na, font.family_default, true)

// === ALERT CONDITIONS ===
alertcondition(cg, title = 'RSI Buy')
alertcondition(cr, title = 'RSI Sell')

// === RSI BACKGROUND PLOT ===
hline(50, color = color.new(#787B86, 0))
rs = hline(80)
rss = hline(30)
fill(rs, rss, color = color.rgb( 100-x,x, x/2, 25), title = 'RSI Background Fill')

// === FINAL LINES FOR PRICE PROJECTIONS (OVERLAY LINES) ===
xo5 = 0.0
yo5 = 0.0
xyo5 = 0.0
xxo5 = 0.0
for i = 0 to len - 1 by 1
    xo5 := xo5 + i / len
    yo5 := yo5 + src[len - 1 - i + ta.barssince(cg)] / len
    xyo5 := xyo5 + i * src[len - 1 - i + ta.barssince(cg)] / len
    xxo5 := xxo5 + i * i / len
    xxo5

dizi5 = array.new_float(len * 2 + 1 + extrapolation)
linedizi5 = array.new_line()
a5 = (xo5 * yo5 - xyo5) / (xo5 * xo5 - xxo5)
b5 = yo5 - a5 * xo5
for i = 0 to len - 1 + extrapolation by 1
    array.set(dizi5, i, a5 * i + b5)

if cg
    line.new(ta.valuewhen(cg, bar_index, 0) - len +1, ta.valuewhen(cg, array.get(dizi5, 0), 0), ta.valuewhen(cg, bar_index, 0), ta.valuewhen(cg, array.get(dizi5, len - 1), 0), color = color.rgb(255, 0, 0), width = linewidth, force_overlay = true)

xo6 = 0.0
yo6 = 0.0
xyo6 = 0.0
xxo6 = 0.0
for i = 0 to len - 1 by 1
    xo6 := xo6 + i / len
    yo6 := yo6 + src[len - 1 - i + ta.barssince(cr)] / len
    xyo6 := xyo6 + i * src[len - 1 - i + ta.barssince(cr)] / len
    xxo6 := xxo6 + i * i / len
    xxo6

dizi6 = array.new_float(len * 2 + 1 + extrapolation)
linedizi6 = array.new_line()
a6 = (xo6 * yo6 - xyo6) / (xo6 * xo6 - xxo6)
b6 = yo6 - a6 * xo6
for i = 0 to len - 1 + extrapolation by 1
    array.set(dizi6, i, a6 * i + b6)

if cr
    line.new(ta.valuewhen(cr, bar_index, 0) - len +1, ta.valuewhen(cr, array.get(dizi6, 0), 0), ta.valuewhen(cr, bar_index, 0), ta.valuewhen(cr, array.get(dizi6, len - 1), 0), color = color.rgb(0, 255, 0, 0), width = linewidth, force_overlay = true)
