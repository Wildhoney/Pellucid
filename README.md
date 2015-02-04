# Pellucid

![Travis](http://img.shields.io/travis/Wildhoney/Pellucid.svg?style=flat)
&nbsp;
![Experimental](http://img.shields.io/badge/experimental-%E2%9C%93-blue.svg?style=flat)
&nbsp;
![License MIT](http://img.shields.io/badge/license-mit-orange.svg?style=flat)

* **Heroku**: [http://pellucid.herokuapp.com/](http://pellucid.herokuapp.com/)

As `Pellucid` is a highly experimental module, it requires a browser that supports [Custom Elements](http://caniuse.com/#search=custom%20element). With the lack of any screenshot API, `Pellucid` uses antiquated `iframe` elements to create a crystalline blurred background for your elements &ndash; as such there are certain downsides. `Pellucid` merely loads the current page in its default state, and therefore any elements which have been modified since the initial state will not be included in the crystalline background &ndash; this affects greatly SPAs and pages that use POST data. Considerations should also be taken for the duplicated page-load.

![Screenshot](http://i.imgur.com/Azepeaq.png)

## Browser Support

![Chrome](https://github.com/alrra/browser-logos/raw/master/chrome/chrome_64x64.png)
![Firefox](https://github.com/alrra/browser-logos/raw/master/firefox/firefox_64x64.png)
![Firefox](https://github.com/alrra/browser-logos/raw/master/opera/opera_64x64.png)
![Safari](https://github.com/alrra/browser-logos/raw/master/safari/safari_64x64.png)

For browsers that do not support `createElement`, `Pellucid` should render as a translucent background without the crystalline blurred effect.

---

## Getting Started

```html
<section is="pellucid-container" data-pellucid-blur="15px">
    <h1>Drag Me&hellip;</h1>
</section>
```

With the above code `Pellucid` should create a crystalline background for you! Using the `data-pellucid-blur` attribute you can define how blurred the background is. Any elements that are appended to the `section` element will be automatically transposed into a `div` element with a `content` class.

`Pellucid` will render the following HTML structure given the above code:

```html
<section is="pellucid-container" style="...">
    <div class="background" style="...">
        <iframe class="pellucid" src="http://localhost:5000/"></iframe>
    </div>
    <div class="content" style="...">
        <h1>Drag Me…</h1>
    </div>
</section>
```

By default `Pellucid` will not make your elements draggable &ndash; you can instead use something such as [Draggabilly](http://draggabilly.desandro.com/) &mdash; which is what the [example uses](https://pellucid.herokuapp.com/).
