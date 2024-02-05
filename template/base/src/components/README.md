# Component Recommended Rules

- When possible each component should be defined in its own dedicated file (SFC)
- Single File components should be named in PascalCase
- Base components should all start with the same prefix (like **V**, **Base** or **App**)
  - You can think of base components as your app-wide reusable components like a button or a modal
  - This groups them together and declares their global, reusable nature
- Component names should always be multi-worded to not conflict with any existing or future HTML elements. Don't create a Table or a Button component.
- Single instance components should begin with the prefix **The**
  - For example a site header or footer
  - This groups them together and declares them as single use
- Tightly coupled child components should be prefixed with their parent component's name
  - For instance a TodoListItem in a TodoList
  - This groups them together and declares them related
- Component names should begin with the most top level (usually general) words and end with the most specific
  - Such as SearchWidgetInput, SearchWidgetResultsList, SearchWidget
  - This groups related components together in the file structure

Besides these, [the full style guide](https://vuejs.org/style-guide/) has a number of other standards that will help your project be more predictable to a community-wide audience of developers.

## A Flat Component Directory

You might have noticed a common thread amongst most of the component rules from the Vue Style Guide earlier. The naming conventions always help group related components together in the file system. Because of this, combined with reasons below, I suggest adopting the standard of a flat component directory. A flat component directory has the following benefits:

- Quickly and easily go from spotting a component in Vue devtools to finding the file in the codebase (the filename and the component name are the same)
- Use your IDE's quick find or file jumping feature to filter files based on their most general attribute down to the more specific
- Remove analysis paralysis when it comes to deciding how to organize components into sub directories
- Be able to see all your components at once in a single list
- Get rid of the redundancy of keywords in filenames AND in the directory (that is if you're following the style guide (and you should be) and you're using nested directories) (ie. post/PostList.vue, post/PostFeature.vue, etc)
- Remove the temptation to use short one word component names which is easier to do with nested directories (ie. post/List.vue, post/Feature.vue ) and violates the style guide
- Eliminate surfing the file structure in and out of directories to find a component
- Simplify importing components (will always be import SomeComponent from "@/SomeComponent")

![components](https://github.com/MentorMate/create-vue/assets/69005114/50996bc8-946e-4818-8985-c65812e5b6e6)

While your large scale application will obviously have many more files, each one is just another component name in a single well organized list so while the scope of the file structure may expand, the complexity does not.

---

Source:

- [Vue School](https://vueschool.io/articles/vuejs-tutorials/how-to-structure-a-large-scale-vue-js-application/)
- [Vue style guide](https://vuejs.org/style-guide/)
