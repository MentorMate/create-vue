## Standardized Route/Page Naming Convention

While there are some community-wide standards that you would do well not to ignore, there are also a number of standards you can make for you or your team in order to make your code bases more predictable. The kicker is sticking to them across projects so they will serve their purpose.

In your typical CRUD application you have the following different pages for each resource:

1. a list of all the resources
2. a view of a single resource
3. a form to create the resource
4. and a form to edit the resource

| Path             | Route and Component Name | What it Does              |
| ---------------- | ------------------------ | ------------------------- |
| /users           | UsersIndex               | List all the users        |
| /users/create    | UsersCreate              | Form to create the user   |
| /users/{id}      | UsersShow                | Display the users details |
| /users/{id}/edit | UsersEdit                | Form to edit the user     |

```text
src/pages/
├── index.vue
└── users/
    ├── index.vue
    ├── [id].vue
    ├── [id]-edit.vue
    └── create.vue
```

For further consistency and flexibility you should also always reference your routes via their name when using them in router-links and when referencing them programmatically. For example

```
<router-link :to="{name: 'UsersIndex'}">Users</router-link>
```
