# bildr

**bildr** is a HTML5 web application built with a Ruby and Sinatra back-end and a MaterializeCSS front-end. bildr was created to allow for easy and quick creation of item sets outside of the League of Legends client while providing more information than the client's item set builder, such as item efficiency statisitics. This application was made as a submission for the [Riot Games API Challenge 2.0](https://developer.riotgames.com/discussion/announcements/show/2lxEyIcE).

The site can be viewed at [bildr.co](http://bildr.co).

## Installation and Set-up

**_If you want to run the app locally._**

### Prerequisites

* Ruby
* Bundler
* A Riot Games API key

### Set-up

1. First clone the repository with `git clone https://github.com/jacobnisnevich/item-set-builder.git`
2. Navigate to the cloned directory with `cd item-set-builder/`
3. Run bundler to install the required Ruby gems with `bundle install`
4. Set up a system environment variable named `LOL_KEY` and set it equal to your Riot Games API key. If you are using Windows, set the variable in _Control Panel | System Properties | Environment Variables_. If you are using Linux or OS X simply run `export LOL_KEY=<YOUR API KEY>`

### Usage

1. Start the application with `ruby app.rb` from the application's root directory
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

Selecting items is as simple as picking them from the _All Items_ tab in the left-side menu and dropping them into an open item slot. **bildr** supports dropping items into filled item slots by pushing all items down or stacking where applicable. Furthermore, **bildr** follows the League of Legends stacking rules, with no more than five health or mana potions, three stealth wards, and two vision wards.

In order to help find the items you want, **bildr** incorporates the filtering system found in the League of Legends item shop, with support for filtering by multiple stats and searching for specific stats in the search bar.

The drag-and-drop functionality built in to **bildr** utilizes the HTML5 standard for drag-and-drop, and as such supports a wide variety of browsers. Unfortunately, mobile browsers are not supported at this time.

In addition to all the information found in the League of Legends shop being available in tooltips over each item, the tooltips also include information on gold efficiency where applicable. The item data is taken from the League of Legends `static-data` API endpoint with item images taken from [Data Dragon](http://ddragon.leagueoflegends.com/tool). The information for item efficiency is parsed into a usable JSON format with Ruby scripts from a [fan-made spreadsheet](https://docs.google.com/spreadsheets/d/1ASPk9DIQug-3x7d2ZZ5PU7c7-NiE9Tj5q3MgeIYZoc4/edit#gid=2147374466) and merged into a single file with the data from the Riot Games API. This merged data can be retrieved publicly from:

```
http://bildr.co/getItems
```

### Item Set Info and Properties

In the _Set Info_ tab of the left-side menu, users can set the item set name, specific map and mode, and specific champion. Leaving the map and champion un-selected leaves the item set as global. Uploading and downloading the item set will incorporate this information in the JSON data. 

Champion data is collected from the Riot Games  `static-data` API endpoint with champion icon images taken from [Data Dragon](http://ddragon.leagueoflegends.com/tool). Map images are screen-captured from the League of Legends client and cropped horizontally.

### Other Functionality

