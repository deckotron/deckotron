# Deck-o-tron

A build-time tool for compiling HTML presentation decks.

## What does it do?

Deck-o-tron makes it easier to produce HTML-based presentation decks that work with frameworks like [Reveal.js](http://lab.hakim.se/reveal-js/). Rather than having to create and maintain a single, monolithic HTML file containing all of your presentation's slides, you can instead have individual files per slide. Deck-o-tron then takes care of assembling those individual files into the complete HTML document.

Deck-o-tron supports [Nunjucks templates](https://mozilla.github.io/nunjucks/), HTML files and [Markdown files](https://daringfireball.net/projects/markdown/) for your slides. Templates and Markdown files will first be compiled to HTML and then inserted into the final document. For templates, you can supply context data as [JSON](http://www.json.org/) or [YAML](http://yaml.org/) files.

### Example

Given a folder of slides like this:
```
slides/
 └─┬ 01-cover.nunj  # Slide as Nunjucks template
   ├ 01-cover.json  # Context data for the above slide
   │
   ├ 02-elevator-pitch.html  # Slide as HTML file
   │
   ├ 03-why-it-is-awesome.md  # Slide as MD file
   │
   ├ 04-summary.nunj  # Another Nunjucks slide
   └ 04-summary.yaml  # ...this time with YAML context data
```

...Deck-o-tron will produce a single `index.html` file containing all slides.

The order of the slides in the final deck is determined by their filenames. A simple way to control that is to prefix numbers to the filenames, as in the example above. Any other files in the same directory will be ignored by Deck-o-tron.

Deck-o-tron also supports [nested groups of slides](./docs/slide-groups.md) (useful, for instance, to create [vertical slides in Reveal.js](https://github.com/hakimel/reveal.js/blob/master/README.md#markup)) and [sub-folders for individual slides](./docs/slide-folders.md), which can be useful for grouping files that relate to a single slide (e.g. data and images used on that slide).


## Installation and setup

1. Install Deck-o-tron as a dependency: `npm install --save-dev deckotron`
1. TBC - probably make a config file and hook deckotron into your build


## Contributing

Deck-o-tron is open-source and we welcome feedback and contributions. Even small contributions like shares, likes or reporting issues are greatly appreciated!
