# DEVELOPMENT NOTES

## BUGS

-   !! sentence looses focus on the Paragraph
-   backspace sometimes does not trigger change
-   the spell corrector can edit on a locked paragraph.
-   pasting causes un formatted article. shift paste is okay
-   TTS skips lines prefixed with #

## TODO

-   UI: Improve readbility score
-   Setting: Add readbility target percentage
-   Setting: Add readbility toggle
-   offline should load from localstorage
-   HUD should confirm save/sync pass/fail
-   UI: show a version number
-   UI: Underline toggle (on/off)
-   UI: dark theme selected & locked highlighting is too subtle
-   UI: ESC obscured workspace
-   UI: locked paragraph needs an icon to be more obvious
-   UI: visual prompt to signal an edit on a locked paragraph
-   SIDEBAR: mouse down on help icon shows settings description
-   SIDEBAR: files toggle that shows metadata, export etc.
-   reset divider button
-   UI: show list of key trigger shortcuts

## NEW FEATURES or MAJOR REFACTOR

-   ? move DOM dataset to Javascript state tree
-   allow for markdown and fountain inline rendering
-   Article, Paragraph & Sentence have readbility score
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
-   add readbility score to UI
-   on first load settings & files are visible
-   word count should ignore inactive lines
