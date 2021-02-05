# How to Contribute to TAMS Club Calendar

Welcome! We are a completely open-source project, so feel free to contributue as much or as little as you would like! 

## :flight_departure: Where to start

If this is your first time working on an open source project, you can check out the [good first issue label](https://github.com/MichaelZhao21/tams-club-cal/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) for easier or smaller bits of code you can work on. You can also look around the documentation and make some grammar and sentence flow changes. We are, after all, developers and not english majors, so our documentation can always improve! For the more veteran contributors, please feel free to look around at the issues page for a good issue to work on.

## :floppy_disk: Technologies we Use

This project is completely written in [Javascript](https://www.javascript.com/), [HTML5](https://html.com/html5/), and [Sass (SCSS)](https://sass-lang.com/)! We are running both our frontend and backend javascript on [Nodejs 14 (lts/fermium)](https://nodejs.org/en/). All in all, we use a pretty standard MERN stack.

The frontend uses these main libraries:

-   [React.js](https://reactjs.org/) for the main framework of the entire site
-   [Redux](https://redux.js.org/) for the global state management (because React is a little lacking in that department)

The backend uses these main libraries:

-   [Express.js](https://expressjs.com/) as the framework for managing API calls and routes
-   [MongoDB Node.js API](https://docs.mongodb.com/drivers/node/) to store information in a secure database

## :beetle: Bug Reports

Bugs are common in programs that are constantly being developed! Once you have identified a bug, please fill out an issue for the relavent bug. Try to describe the bug in as much detail as possible, so that other people have an easier time resolving it. If you would like to resolve the bug report you have just created, see [Resolving Bugs or Tackling Issues](#resolving-bugs-or-tackling-issues).

## :bulb: New Ideas or Feature Requests

We welcome all new ideas! Please follow the issue template for a feature request to make sure that it can be worked on properly. Again, just like with bug reports, please be **as specific as possible**. It can be especially hard to describe what you are thinking in just words, so we have a section at the bottom for you to attach media, links, or other resources that can help visualize your idea. If you would like to work on the proposed idea, see [Resolving Bugs or Tackling Issues](#resolving-bugs-or-tackling-issues).

## :open_book: Resolving Bugs or Tackling Issues

So you see an issue that you like? As Beyoncé famously said, "_If you like it, then you shoulda put a ring on it._" In other words, **make sure you claim an issue _BEFORE_ you start working on it.** This will guarentee that two people won't be working on the same issue at the same time. You can simply comment "I want to work on this issue" (or some variant of this) on the issue you want to work on.

## :pencil: Submitting Changes

Once you've made the changes that you need, please use the pull request template to create a pull request. Keep you title short and simple (but still descriptive enough to know what the pull request addresses). There is more space within the template to describe in detail what you have changed.

## :computer: Coding Conventions

I am formatting the code with [Prettier](https://prettier.io/) as the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (There are probably similar extensions in other IDEs as well). The `.prettierrc` file contains the
formatting rules for Prettier and will be automatically used when formatting with the VSCode extension.

### File and Organization Conventions

All files will be named with **lowercase** letters and **dash-seperated**. This is because on some systems, capital letters will be ignored in file names. In terms of file organization, the client and server top-level folders contain each individual program, with
seperate `package.json` files and `node_modules` folders. See the [documentation site](https://docs.tams.club) for more specific
information on file structure.

### JS/JSX Conventions

Most of the standard JS formatting will be taken care of by the extension (such as spaces around operators, bracket style, and whitespace). However, there are a few rules that cannot be detected by a formatter:

- There should be a space around each function/method definition
- In the React classes, keep all lifecycle methods at the bottom, in the order that they happen (ie. `componentDidMount` will go before `componentWillUpdate`); the `render` method should be at the end
- If code is used multiple times across components or js files, place it in the `util.js` file in its own function
- All functions outside of React components **must** have JSDoc written, describing in detail what the function does, its parameters, and the return methods. For standard functions, see the [basic JSDoc instructions](https://jsdoc.app/about-getting-started.html). If you are returning an object, please define a [typedef](https://jsdoc.app/tags-typedef.html)

### CSS Formatting

CSS is generally extremely difficult to format, and it can be extremely hard to read your own written css, let alone someone else's! That's why I am going to outline the css convention that will be used in _this project_. Remember that a lot of these standards are my personal preference, and there are many ways that people will format css. My main inspiration for this styling comes from [css-tricks.com](https://css-tricks.com/poll-results-how-do-you-order-your-css-properties/) and [cssguidelin.es](https://cssguidelin.es/):

**Standard selector**

```scss
// Comment describing the selector's quirks
.selector {
    /* Positioning */
    position: absolute;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    /* Display and Box Model */
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    width: 8rem;
    height: 8rem;
    padding: 0.5rem;
    border: 0.1rem solid $background;
    margin: 0;
    flex-direction: row; // And other flexbox/grid props

    /* Color */
    background: $background;
    color: $text-primary;

    /* Text */
    font-family: $main-font;
    font-size: 1.5rem;
    line-height: 1.2rem;
    text-align: center;

    /* Other */
    cursor: pointer;
    transition: 0.3s;
}
```

-   Comments like "positioning" or "color" _don't_ need to be included in the code, but you may add them before the selector if needed
-   You can opt to _not add spaces_ between groups of properties if it looks better, but please group properties if there are too many in a row; we want to avoid blocks of properties with no relation
-   If no spaces are added, still try to keep the properties in the order given above

All selector blocks need to have a space betwwen its adjacent selectors. The only exception to this rule is section headings:

**Section headings**

```scss
.prev-selector {
    //...
}

/*
 * ###################################
 * ##### IMAGE DISPLAY COMPONENT #####
 * ################################### 
 */

.next-selector {
    // ...
}
```

-   There also needs to be a line of whitespace around the section headings
-   Each section heading should look like the one above, with the comment block defined as I have above and 5 pound signs (`#`) around the name of the section, as well as a line above and below filled with pound signs to the same width

**Top-level Description**

At the top of each scss file, you should include a top-level description of the components and general formatting for the page. This will be formatted like the following example:

```scss
/**
 * The Club Card displays the basic club info.
 * 
 * 1) The component has a box-shadow that will darken on hover.
 * 2) The width and height are set so the containing grid can auto-align.
 * 3) A cover photo thumbnail is displayed at the top in its own div.
 *    This cover photo has a default placeholder if it does not exist.
 */

@import '../../custom.scss';

// Other components
```

This should be at the top of your file and have one space before the import statement.

**Importing scss**

The custom stylesheet should _always_ be imported to use the variables. In most cases, that should be the only import you need.

**Section Organization**

If we were given html code that looked like the following:

```html
<div className="club-card">
    <div className="club-card-image-container">
        <img className="club-card-image" src="https://www.example.com" />
    </div>
    <p className="club-card-title">Card Title</p>
</div>
```

Then we should group the css by relevant contents:

```scss
/**
 * The club card component does this.
 *
 * 1) Here is specific descriptions
 * 2) This is a list!
 *
 * Any final tidbits can go here
 */
@import '../../custom.scss';

.club-card {
    // The main component goes here
}

/*
 * #########################
 * ##### IMAGE DISPLAY #####
 * ######################### 
 */

// Extra notes about this component go here
// This can overflow to subsequent lines
.club-card-image-container {
    display: flex;
    // ... (see styling selectors above)
}

// This is the child of the selector above,
// so it goes here because it's the most relavent
// Also, since there are only 3 props,
// we don't have to put spaces
.club-card-image {
    align-self: center;
    width: 100%;
    height: 100%;
}

/*
 * #########################
 * ##### TEXT ELEMENTS #####
 * #########################
 */

// This is a new section for the text elements
// Note once again the spaces around the section header
.club-card-title {
    font-size: 1rem;
}
```

This should be how all of the stylesheets are formatted, except maybe the general stylesheet.

**CSS Tips**

Here is a list of suggestions or style things that you should keep in mind:

-   Use dashes instead of camelcase for class names
-   Extra Sass variables and mixin definitions can go at the top of the stylesheet
-   Again, a lot of the formatting still comes down to coder discretion but just keep in mind that you won't be the only person reading the code!

### Final Coding Tips

Remember that these coding conventions are put in place not neccessarily to help you code faster, but to make your code more readable and easier to follow for *other people*. Especially given that this is an open-source project, it's imperative that your code can be understood quickly and easily by others! If there is a place where you need to break away from the above formatting because it makes more sense to, feel free to do it. Again, we are going for maximum re-readability. Have fun working on our project, and we look forward to your contributions!