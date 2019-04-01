# DEVELOPMENT NOTES

## BUGS

-   !! sentence looses focus on the Paragraph
-   backspace sometimes does not trigger change
-   the spell corrector can edit on a locked paragraph.
-   pasting causes un formatted article. shift paste is okay
-   TTS skips lines prefixed with #

# TODO

-   on first load settings & files are visible
-   offline should load from localstorage
-   HUD should confirm save/sync pass/fail
-   show a version number
-   Underline toggle (on/off)
-   dark theme selected & locked highlighting is too subtle
-   ESC obscured workspace
-   locked paragraph needs an icon to be more obvious
-   visual prompt to signal an edit on a locked paragraph
-   ? move DOM dataset to Javascript state tree
-   word count should ignore inactive lines
-   mouse down on help icon shows settings description
-   files toggle that shows metadata, export etc.
-   reset divider button
-   show list of key trigger shortcuts

## NEW FEATURES or MAJOR REFACTOR

-   allow for markdown and fountain inline rendering
-   color comments
    -   eg //? //! //# /// red, green. blue & white
    -   these color the line in the sentence editor
    -   and mark the paragraph with an icon/bookmark
-   Improve TTS UI/UX
    -   design TTS playback HUD widget
    -   play/pause/cont/loop/
    -   refactor TTS controller ie. syncronous stack
    -   voice/picth/rate settings
    -   pause/resume blank delay for blank lines
    -   read a text selection
-   floating menu on the divider
    -   re-focus selected paragraph
    -   read selected paragrapg
    -   maximise/minimize workspace?
    -   next/previous paragraph
    -   flatten/unlock current paragraph

## CHANGELOG/BUG FIXES

-   remote server sync
-   backup/restore localstorage
-   global SHIFT key css modifier (SHIFT = Save As)
-   file txt/json export
-   save current article
-   wordcounter not working on init.
-   read selected paragraph
-   read entire article
-   rename is triggered by cta EDIT
-   chrome extension to backup/sync localstorage **QUOTA LIMIT**
-   SHIFT Basckspace = delete line
-   Holding shift down causes rapid sentence toggling.
-   SHIFT Enter = new line without line break
-   resize divider after server sync
-   wordcount target that alerts when the target is met
-   onLoad: selected para should populate sentence editor
-   new document should highlight sidebar
-   delete current resets to first article
-   sync load should pull first
-   refactor file/settings into sperate panels
-   double shift on empty P throws error
-   sync should check diff delta or timestamp
