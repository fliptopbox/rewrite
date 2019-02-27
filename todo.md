# DEVELOPMENT NOTES

## BUGS

-   !! sentence looses focus on the Paragraph
-   backspace sometimes does not trigger change
-   the spell corrector can edit on a locked paragraph.
-   pasting causes un formatted article. shift paste is okay
-   Holding shift down causes rapid sentence toggling.

# TODO
-   Underline toggle (on/off)
-   dark theme selected & locked highlighting is too subtle
-   floating menu on the divider
    -   re-focus selected paragraph
    -   read selected paragrapg
    -   maximise/minimize workspace?
    -   next/previous paragraph
    -   flatten/unlock current paragraph
-   SHIFT Basckspace = delete line
-   SHIFT Enter = new line without line break
-   color comments 
    - eg //? //! //# /// red, green. blue & white
    - these color the line in the sentence editor
    - and mark the paragraph with an icon/bookmark
-   wordcount target that alerts when the target is met
-   locked paragraph needs an icon to be more obvious
-   visual prompt to signal an edit on a locked paragraph
-   ? move DOM dataset to Javascript state tree
-   word count should ignore inactive lines
-   mouse down on help icon shows settings description
-   files toggle that shows metadata, export etc.
-   reset divider button
-   ESC obscured workspace
-   show list of key trigger shortcuts
-   chrome extension to backup/sync localstorage
-   refactor file/settings flexbox vertical
-   allow for markdown and fountain inline rendering
-   Improve TTS UI/UX
    -   design TTS playback HUD widget
    -   play/pause/cont/loop/
    -   refactor TTS controller ie. syncronous stack
    -   voice/picth/rate settings
    -   pause/resume blank delay for blank lines
    -   read a text selection

## CHANGELOG/BUG FIXES

-   global SHIFT key css modifier (SHIFT = Save As)
-   file txt/json export
-   save current article
-   wordcounter not working on init.
-   read selected paragraph
-   read entire article
-   rename is triggered by cta EDIT
