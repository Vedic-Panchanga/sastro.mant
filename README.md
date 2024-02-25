# Todo

## chart setting: general

1. color scheme of elements
2. bi-wheel
3. animate the chart

## chart setting: display

1. add toggle of sun/moon, ect.
2. fixed stars
3. fixed star ring: 28 xiu

check the error page

# Struction

1. root (which is Root.tsx)
   hold and parse general datetime and locations to routes
2. routes (like Chart.tsx): calculate.
   call functions to get the data from wasm.
3. prepare (like ChartDrawingWrapper.tsx): combine data and settings
   cleanup the raw data with settings
4. draw (like SVG.tsx): draw with SVG
