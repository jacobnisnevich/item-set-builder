# bildr

**bildr** is a HTML5 web application built with a Ruby and Sinatra back-end and a MaterializeCSS front-end. bildr was created to allow for easy and quick creation of item sets outside of the League of Legends client while providing more information than the client's item set builder, such as item efficiency statisitics. This application was made as a submission for the [Riot Games API Challenge 2.0](https://developer.riotgames.com/discussion/announcements/show/2lxEyIcE).

The site can be viewed at [bildr.co](http://bildr.co).

## Installation and Set-up

### Prerequisites

* Ruby
* Bundler
* A Riot Games API key

### Set-up

1. First clone the repository with ```git clone https://github.com/jacobnisnevich/item-set-builder.git```
2. Navigate to the cloned directory with ```cd item-set-builder/```
3. Run bundler to install the required Ruby gems with ```bundle install```

### Usage

1. Start the application with ```ruby app.rb``` from the application's root directory
2. The application can be viewed from any browser at [localhost:4567](http://localhost:4567)

## Features and Functionality

### Upload Item Sets

**bildr** lets you use previously saved League of Legends item sets as templates or starting points for further item set customization. To use a previously created item set navigate to:

```
League of Legends\Config\Global\Recommended\
```

for global item sets. Or to:

```
League of Legends\Config\Champions\{championKey}\Recommended\
```

for a champion specific item set. **bildr** will automatically parse the JSON into visual, manipulable item blocks.

### Download Item Sets

When you're done with your item set, you can download the item set by simply clicking the *Download* button in the navigation bar. When downloaded, the application will notify you where to place the completed item set, either to the global directory or champion-specific directory as listed above.

### Saving to Browser Storage

If you are working on a item set in **bildr** but need to close your browser or restart your computer for some reason, the application gives you the option to save your in progress item set with the *Save* button.

Saving your item set works by utilizing the ```localStorage``` functionality of modern browsers. If for some reason you neeed to clear your saved item set, simply hit *Reset* and then *Save*.

*(Note: you can only have one item set saved at a time and clicking *Save* will overwrite any previously saved item set)*

### Item Block Manipulation

In the item block manipulation panel, the user has four possible ways to manipulate item sets:

1. Expand and collapse the item blocks
2. Rename the item blocks
3. Create new item blocks
4. Delete existing item blocks

Item blocks are simply extensions of the MaterializeCSS collapsible object and have all the functionality of these constructs.

### Item Selection and Drag-and-Drop

### Item Set Info and Properties

### Other Functionality
