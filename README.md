# mirador-disable-zoom

![window zoom disable button](images/window-zoom-disable.png)

## Setup
Drop these files into your Mirador build output directory and point your webpage to them:
```html
...
<html>
    <head>
        ...
        <link rel="stylesheet" type="text/css" href="mirador-combined.css">
        <link rel="stylesheet" type="text/css" href="MiradorDisableZoom.css">
        ...
    </head>
    <body>
        <div id="viewer"></div>
        <script src="mirador.js"></script>
        <script src="MiradorDisableZoom.js"></script>
        <script type="text/javascript">

        $(function() {
            Mirador({
                ...
            });
            ...
        });

    </body>
```
