# Deck-o-tron slide groups

Some HTML presentation frameworks, such as [Reveal.js](http://lab.hakim.se/reveal-js/), support some notion of nested slides. For example, in Reveal.js your slides are normally laid out horizontally, but you can have a sequence of vertical slides in place of a single, "normal" slide. The corresponding HTML markup goes like this:

```
<div class="reveal">
  <div class="slides">
  <section>Single Horizontal Slide</section>
    <section>
      <section>Vertical Slide 1</section>
      <section>Vertical Slide 2</section>
    </section>
    <section>Another Horizontal Slide</section>
  </div>
</div>
```

This is where Deck-o-tron slide groups come in handy. The files for "Vertical Slide 1" and "Vertical Slide 2" would be placed into a slide group folder, which follows the naming format `[group-name].group/`. As with slides, you may use a numeric prefix on the folder name, to control the ordering.

To generate the above Reveal.js markup, we might organise our slide files like this:
```
slides/
 └─┬ 01-single-horizontal-slide.nunj  # Do the 1st slide as per usual
   │
   ├ 02-vertical-slides.group/  # Create the slide group
   │  └─┬ 01-vertical-slide-1.nunj  # 1st vertical slide
   │    └ 02-vertical-slide-2.nunj  # 2nd vertical slide
   │
   └ 03-another-horizontal-slide.nunj  # Another bog-standard slide
```

The processing of slide files within the group behaves exactly like it does within the top-level slides folder. You can even use [slide folders](./slide-folders.md) within the group if you wish.
