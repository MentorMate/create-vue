# Goal

The goal of this exam is to ensure your proficiency with Vue:
- Reactivity
- Two-way data binding
- Class/Style binding
- Watchers
- Lifecycle hooks
- Directives

## Setup Process

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

## Task

### Optional
1. Form validation
2. Unit testing
3. Typescript

### Let's create a task/todo list functionality (use `TaskView.vue`)
1. Encapsulate logical page components into separate components
2. Do not move taskList variable in `TaskView.vue` (The goal is to test two way data binding and passing data between components)
    - If you find it difficult you can use Pinia
3. Create task component
    - The goal of this component is to create a task
    - Supply key press controls: On keypress `C` it should trigger create task functionality
    - alert("So much tasks...") if there are more than 3 tasks created
4. Listing tasks:
    - List all the tasks
    - Use slot to pass the title
    - Change the text color of the 2nd task
    - When the user clicks delete button - it should remove the task
    - No tasks message
5. Error page - intercept wrong urls

