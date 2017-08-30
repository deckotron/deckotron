# Deck-o-tron slide folders

If you keep all source files associated with your presentation in the same folder, it can sometimes become a bit unwieldy. To help keep things better organised, Deck-o-tron allows you to place all files relating to a single slide into their sub-folder.

The format is `[slide-name].slide/`. Similar to normal slide files, the `[slide-name]` portion of the folder's name will be used to determine the slide's position within the presentation deck. You can therefore prefix it with a number to control the ordering, if needed.

At a minimum, the slide folder *must* contain a Nunjucks template (`.nunj`), HTML file (`.htm` or `.html`) or Markdown file (`.md`) that can be used to generate the slide. Furthermore, that file's name must match the `[slide-name]` used for the folder.

You can also add `.json` or `.yaml` files, again with file names that match `[slide-name]`, into your slides folder. These will then be used to provide the context data to a Nunjucks template.

Any other files in the slide folder will be ignored by Deck-o-tron. This can be useful, if your slide contains image or other media that you'd like to keep within the same slide folder.

For example:

```
slides/
 └─┬ ... # Other slides & files
   │
   └ 42-tidy-slide.slide/  # Slide folder "tidy-slide"
      └─┬ tidy-slide.nunj  # Slide content
        ├ tidy-slide.yaml  # Slide context data
        │
        └ lolcat.gif  # Other files are ignored
```

## Notes

* Only the name, including any numeric prefix, of the slide folder itself is used to determine where the slide appears in the final deck. If the slide content and/or context data files _within_ the folder contain numeric prefixes, they have no effect.
* If a slide _file_ and a slide _folder_ that share the same name exist, then the slide _folder_ will take precendence and the file will be ignored.
