# The Command Line

## Usage and Commands

The searchbar also acts as your command line. The input field has two modes, the search mode and the terminal mode. It is possible to switch between the two modes with the command `tm` or `terminal-mode`.

By default, the decorator in search mode will be `>` and the placeholder text will read `Enter command or search term, "au:help" for help.` In terminal mode the decorator will be `$` and the placeholder text will read `Enter command...`

While in search mode all special commands must be preceeded immediately by the prefix `au:`. For example, to switch from search mode to terminal mode the below shown command must be entered.

    au:tm

While in terminal mode all commands must be input without any prefixes. For example, to switch back to search mode from terminal mode the below shown command must be entered.

    tm

In this document it will be assumed that all commands will be inputted in terminal mode, as such no prefixes will be shown on the examples. 

Another point of note is that all commands have long-form and short-form alternatives. For example, to switch between input modes, instead of;

    tm

The below show command can be used as well:

    terminal-mode

While both forms of the commands will be shown in the document, the examples will use the short-form versions of the commands.

# Utility Commands

### `terminal-mode || tm`

Switches between search and terminal modes.

Usage:

    tm

### `message-clear || mc`

Clears error and help messages.

Usage:

    mc

### `help || h`

Displays a help message that links to this document.

Usage:

    h

### `clock-mode || cm`

Toggles between the 24-hour and 12-hour modes of the time display.

Usage:

    cm

### `search-engine || se`

Changes the search engine of the searchbar to the inputted service. Currently the supported engines are `duckduckgo` and `google`.

Usage:

    se <search engine>

# Theming

## Color Commands

These commands deal with changing various colors around the startpage. They all accept CSS colors as their parameters. For example, to change a color to black, `#000`, `rgb(0,0,0)` and `black` are all valid arguments.

### `color-background || cb`

Changes the background color to a given CSS color.

Usage:

    cb <CSS color>

### `color-foreground || cf`

Changes the foreground / text color to a given CSS color.

Usage:

    cf <CSS color>

### `color-accent || ca`

Changes the accent color used in the image border, searchbar border and searchbar decoration to a given CSS color.

Usage:

    ca <CSS color>

## Image Commands

These commands deal with the image on display at the center of the screen. For custom images, the recommended ratio is 4:1 to avoid any cutoffs.

### `image-set || is`

Changes the display image to an image from the given URL.

Usage:

    is <image URL>

### `image-clear || ic`

Sets the display image back to the default image.

Usage:

    ic

## Other Theming Commands

This section contains commands that deal with various theming options that do not fit

### `search-placeholder || sp`

Changes the placeholder text of the searchbar to the given string in search mode.

Usage:

    sp <placeholder text>

# Link List Commands

These commands deal with the links on display under the display image. For all commands that require a link index parameter, the input must be an integer. The index is counted in a top-left to bottom-right fashion starting from 1.

For commands that require a link name, this name can be composed of multiple words seperated by spaces.

### `link-add || la`

Adds a link to the end of the link list.

Usage:

    la <link name> <link URL>

### `link-remove || lr`

Removes a link with the given index in the list.

Usage:

    lr <link index>

### `link-set || ls`

Changes the link at the given index' content to the given name and URL.

Usage:

    ls <link index> <link name> <link URL>

### `links-export || exl`

Brings up a pop-up window that displays a string which can be stored by the user in order to save their link list.

Usage:

    exl

### `links-import || iml`

Brings up a pop-up window that can be used to import previously exported link lists.

Usage:

    iml

# Settings

### `settings-save || ss`

Saves all changes made using the above shown commands. No changes are final until saved.

Usage:

    ss

### `settings-load || sl`

Loads the last saved settings and links, reverts all unsaved changes.

Usage:

    sl

### `settings-reset || sr`

Resets all settings and links to defaults. This command does NOT need saving and cannot be reverted unless the user has back-ups of their settings and links exported.

Usage:

    sr

### `settings-export || exs`

Brings up a pop-up window that displays a string which can be stored by the user in order to save their settings, not including their link list.

Usage:

    exs

### `settings-import || ims`

Brings up a pop-up window that can be used to import previously exported settings, not including link lists.

Usage:

    ims