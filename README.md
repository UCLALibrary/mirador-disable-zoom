# mirador-window-zoom-disable
A Mirador plugin that allows users to disable (and re-enable) zoom controls per window.

## Setup
Drop these files into your Mirador build output directory and point your webpage to them:
```html
...
<head>
    ...
    <link rel="stylesheet" type="text/css" href="mirador-combined.css">
    <link rel="stylesheet" type="text/css" href="MiradorWindowZoomDisable.css">
    ...
</head>
<body>
    <div id="viewer"></div>

    <script src="build/mirador/mirador.js"></script>
    ...
    <script src="MiradorWindowZoomDisable.js"></script>
    ...
    <script type="text/javascript">

    $(function() {
        Mirador({
            ...
```
